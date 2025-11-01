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

## Neuerungen in 1.0.1

- ✨ **Komfortable UI**: Region & Teilregion jetzt **per Dropdown** wählbar. Die Listen werden aus dem offiziellen DWD-Pollenfeed geladen (interner Admin-Proxy, keine CORS-Probleme).
- ⏱️ **Auto-Refresh**: Optionaler Intervall in Sekunden – der Node ruft den Feed automatisch neu ab.
- 🔗 **DWD-Link**: Direkter Verweis auf die amtliche Gebietsübersicht:
  https://www.dwd.de/DE/leistungen/gefahrenindizespollen/Gebiete.html

---

## Konfiguration (3 Felder)

1. **Region**  
   Auswahl der übergeordneten DWD-Region (z. B. „6 – Nordrhein-Westfalen“).  
   Die Liste wird automatisch aus dem Feed geladen.

2. **Teilregion**  
   Feinere Gebietsauswahl innerhalb der Region (z. B. „1 – westlich“, „2 – östlich“).  
   Die verfügbaren Teilregionen hängen von der gewählten Region ab und werden dynamisch angeboten.

3. **Auto-Refresh (Sek.)** *(optional)*  
   Wenn > 0, ruft der Node den Pollenfeed automatisch alle X Sekunden ab.  
   Wert **0** deaktiviert den Auto-Refresh.

**Hinweis:** Eine erläuternde Übersicht der DWD-Gebiete findest du hier:  
https://www.dwd.de/DE/leistungen/gefahrenindizespollen/Gebiete.html