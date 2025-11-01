# Changelog

## 1.0.1 — 2025-11-01
### Added
- Editor-UI mit **Dropdowns für Region & Teilregion** (Daten dynamisch aus DWD-Feed, via Admin-Proxy).
- **Auto-Refresh** (Sekunden) als optionales Feld.

### Docs
- README ergänzt (Feldbeschreibung, Link zur DWD-Gebietsseite).

## [1.0.0] - 2025-10-31
### Added
- Initial release of `node-red-contrib-dwd-pollen`
- Fetches and parses DWD Pollenflug-Gefahrenindex (`s31fg.json`)
- Supports Partregion-ID or name fallback
- Day filter (today/tomorrow/day after tomorrow/all)
- Auto-refresh & fetch-on-deploy
- Textual level descriptions
- Structured JSON output
