/**
 * DWD Pollen Node
 * Features:
 *  - Admin-Endpoint /dwd-pollen/regions: liefert Region/Teilregionen (mit Cache)
 *  - Optionen: fetchOnDeploy (sofort abrufen), autoRefreshSec (Intervall)
 *  - msg.regionId / msg.partregionId überschreiben die Konfig
 */
module.exports = function (RED) {
    const axios = require("axios");

    // -------- Admin-Endpoint: Region/Teilregionen holen (mit Cache) ----------
    let _regionsCache = { ts: 0, data: null };
    const CACHE_MS = 6 * 60 * 60 * 1000; // 6h

    RED.httpAdmin.get("/dwd-pollen/regions", async (req, res) => {
        try {
            const now = Date.now();
            if (!_regionsCache.data || now - _regionsCache.ts > CACHE_MS) {
                const url = "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json";
                const { data } = await axios.get(url, { timeout: 10000, responseType: "json" });

                const byRegion = new Map();
                const content = Array.isArray(data?.content) ? data.content : [];

                for (const e of content) {
                    const rid = e.region_id;
                    const rname = e.region_name;
                    const prid = e.partregion_id;
                    const prname = e.partregion_name;

                    if (!rid || !rname) continue;

                    if (!byRegion.has(rid)) {
                        byRegion.set(rid, { id: String(rid), name: String(rname), parts: [] });
                    }
                    if (prid && prname) {
                        byRegion.get(rid).parts.push({ id: String(prid), name: String(prname) });
                    }
                }

                const regions = Array.from(byRegion.values())
                    .map(r => ({ ...r, parts: r.parts.sort((a, b) => a.name.localeCompare(b.name, "de")) }))
                    .sort((a, b) => a.name.localeCompare(b.name, "de"));

                _regionsCache = { ts: now, data: { regions } };
            }

            res.json(_regionsCache.data);
        } catch (err) {
            RED.log.warn(`[dwd-pollen] /dwd-pollen/regions failed: ${err.message}`);
            res.status(500).json({ error: "fetch_failed", message: err.message });
        }
    });

    // --------------------------- Runtime-Node -------------------------------
    function DwdPollenNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.name = config.name || "";
        node.regionId = config.regionId || "";
        node.partregionId = config.partregionId || "";
        node.regionName = config.regionName || "";
        node.partregionName = config.partregionName || "";
        node.fetchOnDeploy = !!config.fetchOnDeploy;
        node.autoRefreshSec = Number(config.autoRefreshSec || 0);

        let timer = null;

        async function fetchDataAndSend(trigger) {
            try {
                const regionId = (trigger && trigger.regionId) || node.regionId;
                const partId = (trigger && trigger.partregionId) || node.partregionId;

                if (!regionId && !partId) {
                    throw new Error("Bitte Region oder Teilregion konfigurieren (regionId/partregionId).");
                }

                const url = "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json";
                const { data } = await axios.get(url, { timeout: 15000, responseType: "json" });
                const all = Array.isArray(data?.content) ? data.content : [];

                let filtered;
                if (partId) {
                    filtered = all.filter(e => String(e.partregion_id) === String(partId));
                } else {
                    filtered = all.filter(e => String(e.region_id) === String(regionId));
                }

                const msg = {
                    payload: filtered,
                    meta: {
                        source: url,
                        count: filtered.length,
                        regionId: regionId || null,
                        partregionId: partId || null,
                        regionName: node.regionName || null,
                        partregionName: node.partregionName || null,
                        autoRefreshSec: node.autoRefreshSec || 0,
                        fetchedAt: new Date().toISOString(),
                        initialFetch: !!(trigger && trigger.initial)
                    }
                };

                node.status({ fill: "green", shape: "dot", text: `OK (${msg.meta.count})` });
                node.send(msg);
            } catch (err) {
                node.status({ fill: "red", shape: "ring", text: err.message });
                node.warn(`[dwd-pollen] error: ${err.message}`);
            }
        }

        function startTimerIfNeeded() {
            stopTimer();
            if (node.autoRefreshSec && node.autoRefreshSec > 0) {
                timer = setInterval(() => fetchDataAndSend({}), node.autoRefreshSec * 1000);
                // kleine visuelle Rückmeldung
                node.status({ fill: "blue", shape: "ring", text: `Auto-Refresh ${node.autoRefreshSec}s` });
            }
        }

        function stopTimer() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Input → sofort abrufen (msg.regionId/partregionId überschreiben optional)
        node.on("input", async (msg, send, done) => {
            await fetchDataAndSend({
                regionId: msg.regionId,
                partregionId: msg.partregionId
            });
            if (done) done();
        });

        // Beim Deploy: optional initialer Abruf + Timer starten
        (async () => {
            if (node.fetchOnDeploy) {
                await fetchDataAndSend({ initial: true });
            }
            startTimerIfNeeded();
        })().catch(err => node.warn(`[dwd-pollen] init error: ${err.message}`));

        node.on("close", () => {
            stopTimer();
        });
    }

    RED.nodes.registerType("dwd-pollen", DwdPollenNode);
};