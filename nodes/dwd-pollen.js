/**
 * DWD Pollen Node
 * Features:
 *  - Admin-Endpoint /dwd-pollen/regions: liefert Region/Teilregionen (mit Cache)
 *  - Optionen: fetchOnDeploy (sofort abrufen), autoRefreshSec (Intervall), staleAllow (Fallback auf letzte erfolgreiche Daten)
 *  - msg.regionId / msg.partregionId überschreiben die Konfig
 *  - NEU: pro Pollenart today_desc / tomorrow_desc / dayafter_to_desc
 *  - NEU: Stale-Fallback inkl. _meta.stale
 */
module.exports = function (RED) {
    const axios = require("axios");
    const node = this;
    const NS = "node-red-contrib-dwd-pollen/dwd-pollen";

    function t(key, opts) {
        // Allgemeine Übersetzungsfunktion für diesen Node
        return RED._(`${NS}:${key}`, opts);
    }

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
                    .map(r => ({
                        ...r,
                        parts: r.parts.sort((a, b) => a.name.localeCompare(b.name, "de"))
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name, "de"));

                _regionsCache = { ts: now, data: { regions } };
            }

            res.json(_regionsCache.data);
        } catch (err) {
            RED.log.warn(`[dwd-pollen] /dwd-pollen/regions failed: ${err.message}`);
            res.status(500).json({ error: "fetch_failed", message: err.message });
        }
    });

    // ---------- Hilfsfunktion: Wert -> Beschreibung (0..3 / "0-1" / "1-2" / "2-3") ----------
    // Jetzt i18n-fähig: Texte kommen aus nodes/locales/<lang>/dwd-pollen.json (runtime.level.*)
    function describeLevel(raw) {
        if (raw === null || raw === undefined) return null;
        const key = String(raw).trim();

        // Versuche, eine lokalisierte Beschreibung zu laden, z.B. runtime.level.0-1
        const i18nKey = `runtime.level.${key}`;
        const translated = t(i18nKey);

        // Wenn keine Übersetzung gefunden wurde, liefert RED._ den Key selbst zurück
        if (translated && translated !== i18nKey) {
            return translated;
        }

        // Fallback: lokalisierter "unbekannt"-Text
        return t("runtime.levelUnknown") || key;
    }

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
        node.staleAllow = !!config.staleAllow;

        let timer = null;

        // Letzte erfolgreiche Antwort für Stale-Fallback
        let lastGood = null; // { payload, _meta }

        async function fetchDataAndSend(trigger) {
            const url = "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json";
            try {
                const regionId = (trigger && trigger.regionId) || node.regionId;
                const partId = (trigger && trigger.partregionId) || node.partregionId;

                // Effektiv genutztes staleAllow (msg > node)
                const usedStaleAllow =
                    typeof (trigger && trigger.staleAllow) === "boolean"
                        ? !!trigger.staleAllow
                        : typeof trigger?.msgStaleAllow === "boolean"
                            ? !!trigger.msgStaleAllow
                            : typeof trigger?.staleAllow === "boolean"
                                ? !!trigger.staleAllow
                                : typeof trigger?.msg?.staleAllow === "boolean"
                                    ? !!trigger.msg.staleAllow
                                    : !!node.staleAllow;

                if (!regionId && !partId) {
                    throw new Error(t("runtime.errorMissingRegionOrPart"));
                }

                const { data } = await axios.get(url, { timeout: 15000, responseType: "json" });
                const all = Array.isArray(data?.content) ? data.content : [];

                let filtered;
                if (partId) {
                    filtered = all.filter(e => String(e.partregion_id) === String(partId));
                } else {
                    filtered = all.filter(e => String(e.region_id) === String(regionId));
                }

                // --- Beschreibungen pro Pollenart ergänzen ---
                const enriched = filtered.map(e => {
                    const out = { ...e };
                    if (out.Pollen && typeof out.Pollen === "object") {
                        for (const [pollenName, val] of Object.entries(out.Pollen)) {
                            if (val && typeof val === "object") {
                                out.Pollen[pollenName] = {
                                    ...val,
                                    today_desc: describeLevel(val.today),
                                    tomorrow_desc: describeLevel(val.tomorrow),
                                    dayafter_to_desc: describeLevel(val.dayafter_to)
                                };
                            }
                        }
                    }
                    return out;
                });

                const _meta = {
                    source: url,
                    count: enriched.length,
                    regionId: regionId || null,
                    partregionId: partId || null,
                    autoRefreshSec: node.autoRefreshSec || 0,
                    fetchedAt: new Date().toISOString(),
                    initialFetch: !!(trigger && trigger.initial),
                    stale: false,                  // frisch
                    staleAllow: !!usedStaleAllow   // was effektiv genutzt wurde
                };

                // Letzten Erfolg merken
                lastGood = { payload: enriched, _meta };

                const msg = { payload: enriched, _meta };

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: t("runtime.statusOk", { count: _meta.count })
                });
                node.send(msg);
            } catch (err) {
                // Fallback auf letzte erfolgreiche Daten
                const usedStaleAllow =
                    typeof (trigger && trigger.staleAllow) === "boolean"
                        ? !!trigger.staleAllow
                        : typeof trigger?.msgStaleAllow === "boolean"
                            ? !!trigger.msgStaleAllow
                            : typeof trigger?.staleAllow === "boolean"
                                ? !!trigger.staleAllow
                                : typeof trigger?.msg?.staleAllow === "boolean"
                                    ? !!trigger.msg.staleAllow
                                    : !!node.staleAllow;

                if (usedStaleAllow && lastGood) {
                    const staleMeta = {
                        ...lastGood._meta,
                        stale: true,
                        staleAt: new Date().toISOString(),
                        error: String(err.message || err)
                    };
                    const msg = { payload: lastGood.payload, _meta: staleMeta };
                    node.status({
                        fill: "yellow",
                        shape: "ring",
                        text: t("runtime.statusStale", { count: staleMeta.count })
                    });
                    node.warn(
                        `[dwd-pollen] fetch failed, sent stale data: ${err.message}`
                    );
                    node.send(msg);
                    return;
                }

                node.status({
                    fill: "red",
                    shape: "ring",
                    text: t("runtime.errorFetchFailed", { error: err.message })
                });
                node.error(`[dwd-pollen] error: ${err.message}`, err);
            }
        }

        function startTimerIfNeeded() {
            stopTimer();
            if (node.autoRefreshSec && node.autoRefreshSec > 0) {
                timer = setInterval(() => fetchDataAndSend({}), node.autoRefreshSec * 1000);
                node.status({
                    fill: "blue",
                    shape: "ring",
                    text: t("runtime.statusAutoRefresh", { seconds: node.autoRefreshSec })
                });
            }
        }

        function stopTimer() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Input → sofort abrufen (msg.regionId/partregionId/staleAllow überschreiben optional)
        node.on("input", async (msg, send, done) => {
            await fetchDataAndSend({
                regionId: msg.regionId,
                partregionId: msg.partregionId,
                msgStaleAllow: msg.staleAllow
            });
            if (done) done();
        });

        // Beim Deploy: optional initialer Abruf + Timer starten
        (async () => {
            try {
                if (node.fetchOnDeploy) {
                    await fetchDataAndSend({ initial: true });
                }
                startTimerIfNeeded();
            } catch (err) {
                node.warn(
                    t("runtime.errorInit", { error: err.message })
                );
            }
        })();

        node.on("close", () => {
            stopTimer();
        });
    }

    RED.nodes.registerType("dwd-pollen", DwdPollenNode);
};