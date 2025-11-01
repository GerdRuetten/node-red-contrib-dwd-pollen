module.exports = function (RED) {
    const axios = require('axios');
    const moment = require('moment-timezone');

    const S31_URL = 'https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json';

    // Mapping laut DWD-Doku (s31fg.pdf): 0=keine, 1=gering, 2=mäßig, 3=hoch; -1/undefined = keine Angabe
    const LEVEL_TEXT = {
        '-1': 'k. A.',
        '0': 'keine',
        '1': 'gering',
        '2': 'mäßig',
        '3': 'hoch'
    };

    const POLLEN_FIELDS = [
        'Hasel','Erle','Esche','Birke','Graeser','Roggen','Beifuss','Ambrosia'
    ];

    function matchByNames(entry, cfg) {
        const rn = (entry.region_name || '').toLowerCase();
        const prn = (entry.partregion_name || '').toLowerCase();

        const wantR = (cfg.regionName || '').trim().toLowerCase();
        const wantPR = (cfg.partRegionName || '').trim().toLowerCase();

        if (wantR && !rn.includes(wantR)) return false;
        if (wantPR && !prn.includes(wantPR)) return false;

        if (!wantR && !wantPR) return false; // nichts konfiguriert

        // zusätzliche Namen (Komma-getrennt) – ein Treffer reicht
        const extra = (cfg.extraNames || '')
            .split(',')
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);

        if (extra.length) {
            const hay = `${rn} ${prn}`;
            const hit = extra.some(x => hay.includes(x));
            if (!hit) return false;
        }

        return true;
    }

    async function fetchS31() {
        const res = await axios.get(S31_URL, { timeout: 15000, responseType: 'json' });
        if (res.status !== 200 || !res.data) {
            throw new Error(`HTTP ${res.status} beim Abruf von s31fg.json`);
        }
        return res.data;
    }

    function pickRegion(data, cfg) {
        if (!data || !Array.isArray(data.content)) {
            throw new Error('Ungültiges DWD-Format: content[] fehlt');
        }

        // 1) Direkter Treffer über partRegionId
        const wantId = (cfg.partRegionId || '').toString().trim();
        if (wantId) {
            const byId = data.content.find(c => String(c.partregion_id) === wantId);
            if (byId) return byId;
        }

        // 2) Name-Fallback
        if (cfg.allowNameFallback) {
            const byName = data.content.find(c => matchByNames(c, cfg));
            if (byName) return byName;
        }

        return null;
    }

    function toText(v) {
        const key = (v === null || v === undefined) ? '-1' : String(v);
        return LEVEL_TEXT.hasOwnProperty(key) ? LEVEL_TEXT[key] : 'k. A.';
    }

    function normalize(entry, cfg) {
        const out = {
            region: {
                id: entry.partregion_id,
                region_name: entry.region_name,
                partregion_name: entry.partregion_name
            },
            last_update: entry.last_update || null,
            pollen: {}
        };

        const wantAll = cfg.dayMode === 'all';
        POLLEN_FIELDS.forEach(p => {
            const src = entry.Pollen && entry.Pollen[p];
            if (!src) return;

            const rec = {};
            if (wantAll || cfg.dayMode === 'today') rec.today = src.today ?? null;
            if (wantAll || cfg.dayMode === 'tomorrow') rec.tomorrow = src.tomorrow ?? null;
            if (wantAll || cfg.dayMode === 'day_after_tomorrow') rec.day_after_tomorrow = src.day_after_tomorrow ?? null;

            if (cfg.includeTextLevels) {
                rec.text = {};
                if ('today' in rec) rec.text.today = toText(rec.today);
                if ('tomorrow' in rec) rec.text.tomorrow = toText(rec.tomorrow);
                if ('day_after_tomorrow' in rec) rec.text.day_after_tomorrow = toText(rec.day_after_tomorrow);
            }

            out.pollen[p] = rec;
        });

        return out;
    }

    function setupAutoTimer(node, cfg, fire) {
        if (node._timer) {
            clearInterval(node._timer);
            node._timer = null;
        }
        const sec = Number(cfg.autoRefreshSec || 0);
        if (sec > 0) {
            node._timer = setInterval(() => fire(), sec * 1000);
        }
    }

    function DwdPollenNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.status({ fill: 'grey', shape: 'ring', text: 'idle' });

        const runOnce = async (msgIn) => {
            try {
                node.status({ fill: 'blue', shape: 'dot', text: 'Abrufen…' });
                const json = await fetchS31();
                const picked = pickRegion(json, config);

                if (!picked) {
                    node.status({ fill: 'yellow', shape: 'ring', text: 'Region nicht gefunden' });
                    node.send({
                        payload: null,
                        error: 'region_not_found',
                        note: 'Bitte Partregion-ID setzen oder Name-Fallback/Bezeichnungen prüfen.',
                        _meta: { source: 'DWD s31fg.json', url: S31_URL }
                    });
                    return;
                }

                const payload = normalize(picked, config);
                node.status({ fill: 'green', shape: 'dot', text: (payload.region.partregion_name || payload.region.region_name) });
                node.send({
                    payload,
                    _meta: { source: 'DWD s31fg.json', url: S31_URL, ts: moment().toISOString() }
                });
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'Fehler' });
                node.error(`[DWD-Pollen] ${err.message || err}`, msgIn);
                node.send({ payload: null, error: 'fetch_failed', message: String(err), _meta: { url: S31_URL } });
            }
        };

        node.on('input', (msg) => runOnce(msg));
        setupAutoTimer(node, config, () => runOnce({}));

        // initial fetch on deploy
        if (config.fetchOnDeploy) {
            setTimeout(() => runOnce({}), 500);
        }

        node.on('close', () => {
            if (node._timer) clearInterval(node._timer);
        });
    }

    RED.nodes.registerType('dwd-pollen', DwdPollenNode);
};