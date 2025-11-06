# node-red-contrib-dwd-pollen

Node-RED node to retrieve the official Deutscher Wetterdienst (DWD) Pollenflug-Gefahrenindex (s31fg.json).  
Provides pollen hazard levels for today, tomorrow, and the day after tomorrow for regions and subregions in Germany.

---

## 🌿 Features

- Uses official DWD Open Data `s31fg.json`  
- Provides hazard levels for 8 pollen types (Hasel–Ambrosia)  
- Supports selection by Partregion-ID, Region-/Teilregion-Name, or fallback  
- Options for fetch on deploy, auto-refresh interval, text levels, and day filter  
- Structured JSON output with timestamps  
- Comfortable UI with dropdowns for region and subregion selection  
- Auto-refresh configurable in seconds (0 disables)  
- Direct link to official DWD area overview

---

## 🧩 Installation

### Using the Node-RED Palette Manager

1. Open Node-RED in your browser
2. Go to **Menu → Manage palette → Install**
3. Search for **`node-red-contrib-dwd-pollen`**
4. Click **Install**

### Using command line (for Docker or local installations)

```bash
cd /data
npm install --no-fund --no-audit GerdRuetten/node-red-contrib-dwd-pollen
```

or (if published on npm):

```bash
npm install node-red-contrib-dwd-pollen
```

If Node-RED runs inside Docker, execute from the container shell:

```bash
docker exec -u node-red -it node-red bash -lc 'cd /data && npm install --no-fund --no-audit GerdRuetten/node-red-contrib-dwd-pollen#master'
```

Then restart Node-RED.

---

## 🛠️ Configuration

| Setting              | Description                                                                                  | Example               |
|----------------------|----------------------------------------------------------------------------------------------|-----------------------|
| **Region**           | Select the main DWD region (e.g., “6 – Nordrhein-Westfalen”). List is loaded automatically.   | 6 – Nordrhein-Westfalen |
| **Subregion**        | Select a finer subregion within the region (e.g., “1 – westlich”, “2 – östlich”). Dynamic list based on Region. | 1 – westlich          |
| **Auto-Refresh (s)** | Optional interval in seconds to auto-fetch the pollen feed. Set to 0 to disable auto-refresh. | 3600                  |

---

## 📤 Example Output

```json
{
  "region": "6",
  "subregion": "1",
  "timestamp": "2024-06-01T08:00:00Z",
  "pollen": {
    "hazel": 2,
    "alder": 1,
    "birch": 3,
    "grass": 0,
    "mugwort": 1,
    "nettle": 0,
    "plantain": 0,
    "ambrosia": 0
  },
  "levels_text": {
    "hazel": "moderate",
    "birch": "high"
  }
}
```

---

## 💡 Tips

- Use the dropdowns to easily select your desired region and subregion without needing to know IDs.  
- Set Auto-Refresh to a positive number (seconds) to keep pollen data updated automatically.  
- For detailed area information visit the official DWD pollen hazard index regions page:  
  https://www.dwd.de/DE/leistungen/gefahrenindizespollen/Gebiete.html

---

## 📡 Data Source

This node uses the official Deutscher Wetterdienst (DWD) Open Data feed `s31fg.json` for pollen hazard indices.

---

## ⚖️ License

MIT © 2025 [Gerd Rütten](https://github.com/GerdRuetten)

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

---

## 🔧 Example Flow

```json
[
  {
    "id": "dwd-pollen-node",
    "type": "dwd-pollen",
    "z": "flow-id",
    "name": "DWD Pollen Index",
    "region": "6",
    "subregion": "1",
    "autoRefresh": 3600,
    "x": 200,
    "y": 200,
    "wires": [["debug-node"]]
  },
  {
    "id": "debug-node",
    "type": "debug",
    "z": "flow-id",
    "name": "Pollen Output",
    "active": true,
    "console": "false",
    "complete": "payload",
    "x": 400,
    "y": 200,
    "wires": []
  }
]
```

---

> ⚠️ **node-red-contrib-dwd-pollen** — bringing official DWD pollen index directly into your Node-RED flows.
</file>
