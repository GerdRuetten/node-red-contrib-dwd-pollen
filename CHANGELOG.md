# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- (none)

## [1.2.1] - 2025-11-26
### Changed
- Removed the unused configuration fields **Region Name** and **Subregion Name** from the editor UI  
  (these values are no longer required and caused confusion).
- Cleaned up the editor logic (`oneditprepare`) to remove all code related to those fields.
- Simplified the node configuration: only **regionId** and **partregionId** are stored now.
- Updated help files (`dwd-pollen.html`) in both languages to reflect the streamlined UI.

### Fixed
- Removed the legacy `msg.meta` output field.  
  The node now outputs metadata exclusively under **`msg._meta`**.
- Replaced incorrect translation variables (`{count}`, `{error}`, `{seconds}`)  
  with the correct Node-RED i18n placeholders (`__count__`, `__error__`, `__seconds__`).

### Improved
- Cleaned up locale JSON files by removing unused keys related to the removed fields.
- Ensured consistency with the i18n patterns established in the `node-red-contrib-i18n-test` node.

## [1.2.0] - 2025-11-16
### Added
- Fully rewritten **English README** (modern layout, consistent with entire DWD node family)
- Brand-new **German README (`README_de.md`)**
- Updated and standardised **example flow** (`examples/dwd-pollen-basic.json`)
- Detailed installation instructions (including Node-RED Palette Manager)

### Changed
- Documentation structure unified across all DWD nodes (Pollen, Forecast, Warnings, Rainradar)
- Improved i18n explanations and clarified translator file structure
- General wording and help text clean-up

### Fixed
- Removed outdated and inconsistent documentation sections
- Minor formatting and markdown corrections

### CI
- Automatically mark `-beta`, `-alpha` and `-rc` tags as **GitHub pre-releases**.

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
