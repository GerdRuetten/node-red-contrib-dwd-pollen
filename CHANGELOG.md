# Changelog

## [1.1.1] - 2025-11-15
### Fixed
- Release workflow corrected

## [1.1.0] - 2025-11-13
### Added
- Full internationalization (i18n) support for all UI elements.
- Runtime messages localized via `RED._(...)`.
- Editor UI now supports multi-language labels using `data-i18n`.
- Help text moved to per-language files:
    - `nodes/locales/en-US/<node>.html`
    - `nodes/locales/de/<node>.html`
- Automatic language switching based on Node-RED editor settings
  (“Browser”, “Deutsch”, “English”).

### Changed
- Updated internal structure to use the official Node-RED i18n layout:
    - `nodes/locales/<lang>/<node>.json`
    - `nodes/locales/<lang>/<node>.html`
- Simplified template HTML by removing inline help text.

### Fixed
- Incorrect fallback behavior when JSON catalogs were not found.
- Status messages and error messages now localized correctly.
- 
## [1.0.3] - 2025-11-06
### Docs
- Unified README style and structure with other DWD modules for consistent documentation.

## [1.0.2] - 2025-11-01
### Fixed
- Correct display of the auto-refresh note (separate line, clean layout).

### Added
- Option "Send a request immediately on deploy".
- Region/subregion selection with link to the DWD page.

## 1.0.1 — 2025-11-01
### Added
- Editor UI with **dropdowns for region & subregion** (data dynamically from DWD feed, via admin proxy).
- **Auto-refresh** (seconds) as an optional field.

### Docs
- README extended (field description, link to the DWD area page).

## [1.0.0] - 2025-10-31
### Added
- Initial release of `node-red-contrib-dwd-pollen`
- Fetches and parses DWD Pollenflug-Gefahrenindex (`s31fg.json`)
- Supports Partregion-ID or name fallback
- Day filter (today/tomorrow/day after tomorrow/all)
- Auto-refresh & fetch-on-deploy
- Textual level descriptions
- Structured JSON output
