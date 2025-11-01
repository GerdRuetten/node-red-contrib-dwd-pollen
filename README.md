# node-red-contrib-dwd-pollen

**Node-RED node to retrieve the official DWD Pollenflug-Gefahrenindex (s31fg.json)**

This Node-RED node fetches and parses the official *Deutscher Wetterdienst (DWD)* pollen hazard index.  
It provides pollen forecast levels (today, tomorrow, and day after tomorrow) for regions and subregions in Germany.

## 🌿 Features
- Uses official DWD Open Data `s31fg.json`
- Provides hazard levels for 8 pollen types (Hasel–Ambrosia)
- Supports Partregion-ID, Region-/Teilregion-Name, or fallback
- Options: Fetch on deploy, auto-refresh, text levels, day filter
- Structured JSON output with timestamps
