module.exports = function(RED) {
    const axios = require("axios");

    // --- Admin-Proxy für Editor (CORS-frei) -----------------------------------
    // Cache die Region/Teilregion-Struktur für 30 Minuten
    let cachedRegions = null;
    let cachedAt = 0;
    const CACHE_MS = 30 * 60 * 1000;

    async function fetchRegions() {
        const now = Date.now();
        if (cachedRegions && (now - cachedAt) < CACHE_MS) {
            return cachedRegions;
        }
        const url = "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json";
        const { data } = await axios.get(url, { timeout: 15000 });

        const regions = [];
        if (data && data.regions) {
            for (const [rid, rObj] of Object.entries(data.regions)) {
                const parts = [];
                if (rObj.partregions) {
                    for (const [pid, pObj] of Object.entries(rObj.partregions)) {
                        parts.push({ id: String(pid), name: pObj.partregion_name || String(pid) });
                    }
                }
                regions.push({ id: String(rid), name: rObj.region_name || String(rid), parts });
            }
        }
        cachedRegions = regions;
        cachedAt = now;
        return regions;
    }

    RED.httpAdmin.get("/dwd-pollen/regions", async (req, res) => {
        try {
            const regions = await fetchRegions();
            res.json({ regions });
        } catch (err) {
            res.status(500).json({ error: "failed_to_load_regions", details: String(err && err.message || err) });
        }
    });

    // --- Runtime: Node-Definition ---------------------------------------------
    function DwdPollenNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.name       = config.name || "";
        node.region     = String(config.region || "");
        node.partregion = String(config.partregion || "");
        node.refresh    = Number(config.refresh || 0); // Sek.

        let interval = null;
        node.on("close", function(done){
            if (interval) { clearInterval(interval); interval = null; }
            done();
        });

        node.on("input", async function(msg, send, done) {
            try {
                const result = await loadPollen(node.region, node.partregion);
                send({ payload: result.payload, _meta: result._meta });
                done();
            } catch (err) {
                node.error(`DWD-Pollen Fehler: ${err && err.message || err}`, msg);
                done(err);
            }
        });

        // Auto-Refresh
        if (node.refresh > 0) {
            interval = setInterval(async () => {
                try {
                    const result = await loadPollen(node.region, node.partregion);
                    node.send({ payload: result.payload, _meta: result._meta });
                } catch (e) {
                    node.warn(`DWD-Pollen Auto-Refresh: ${e && e.message || e}`);
                }
            }, node.refresh * 1000);
        }
    }

    async function loadPollen(regionId, partregionId) {
        if (!regionId || !partregionId) {
            throw new Error("Region & Teilregion sind Pflichtfelder");
        }
        const url = "https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json";
        const { data } = await axios.get(url, { timeout: 15000 });

        const region = data?.regions?.[regionId];
        if (!region) throw new Error(`Region ${regionId} nicht gefunden`);
        const part   = region.partregions?.[partregionId];
        if (!part) throw new Error(`Teilregion ${partregionId} in Region ${regionId} nicht gefunden`);

        // Struktur wie im DWD-Feed: Pollenarten mit Levels heute/heute+1/heute+2
        // Werte sind 0..6 oder "-" / null
        const pollen = part?.Pollen || {};
        // Normiere auf array of { type, today, tomorrow, dayafter }
        const payload = Object.keys(pollen).sort().map(key => {
            const entry = pollen[key] || {};
            return {
                type: key,
                today:     coerce(entry.today),
                tomorrow:  coerce(entry.tomorrow),
                dayafter:  coerce(entry.dayafter)
            };
        });

        return {
            payload,
            _meta: {
                source: url,
                last_update: data?.last_update || null,
                next_update: data?.next_update || null,
                region: {
                    id: regionId,
                    name: region?.region_name || null
                },
                partregion: {
                    id: partregionId,
                    name: part?.partregion_name || null
                }
            }
        };
    }

    function coerce(v) {
        // DWD nutzt z.T. "-" für "keine Angabe"
        if (v === "-" || v === undefined || v === null) return null;
        const n = Number(v);
        return isNaN(n) ? null : n;
    }

    RED.nodes.registerType("dwd-pollen", DwdPollenNode);
};