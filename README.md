# node-red-contrib-dwd-pollen

Node-RED node to retrieve the official Deutscher Wetterdienst (DWD) Pollenflug-Gefahrenindex (s31fg.json).  
Provides pollen hazard levels for today, tomorrow, and the day after tomorrow for regions and subregions in Germany.


Information from the German Weather Service (DWD) on the pollen danger index can be found at: https://www.dwd.de/DE/leistungen/gefahrenindizespollen/gefahrenindexpollen.html


---

## 🌿 Features

- Uses official DWD Open Data `s31fg.json`  
- Provides hazard levels for 8 pollen types
  - Grasses
  - Alder
  - Ragweed
  - Mugwort
  - Birch
  - Rye
  - Ash
  - Hazel 
- Supports selection by Region-ID, Partregion-ID or Region-Name, Partregion-Name  
- Options for fetch on deploy, auto-refresh interval, stale allow
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

| Setting              | Description                                                                                                   |
|----------------------|---------------------------------------------------------------------------------------------------------------|
| **Region**           | Select the main DWD region. List is loaded automatically.                    |
| **Subregion**        | Select a finer subregion within the region. Dynamic list based on Region. |
| **Fetch on deploy**  | Optional to send directly a request to DWD after deploy.                                                      |
| **Auto-Refresh (s)** | Optional interval in seconds to auto-fetch the pollen feed. Set to 0 to disable auto-refresh.                 |
| **Stale allow**      | Optional to use cached datas.                                                                                 |

---

## 📤 Example Output

```json
{
  "payload":[
    {
      "partregion_name":"Rhein.-Westfäl. Tiefland",
      "region_id":40,
      "region_name":"Nordrhein-Westfalen",
      "Pollen":{
        "Graeser":{
          "tomorrow":"0",
          "dayafter_to":"0",
          "today":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Erle":{
          "dayafter_to":"0",
          "today":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Ambrosia":{
          "dayafter_to":"0",
          "today":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Beifuss":{
          "today":"0",
          "dayafter_to":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Birke":{
          "today":"0",
          "dayafter_to":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Roggen":{
          "dayafter_to":"0",
          "today":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Esche":{
          "dayafter_to":"0",
          "today":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        },
        "Hasel":{
          "dayafter_to":"0",
          "today":"0",
          "tomorrow":"0",
          "today_desc":"keine Belastung",
          "tomorrow_desc":"keine Belastung",
          "dayafter_to_desc":"keine Belastung"
        }
      },
      "partregion_id":41
    }
  ],
  "meta":{
    "source":"https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json",
    "count":1,
    "regionId":"40",
    "partregionId":"41",
    "regionName":"Nordrhein-Westfalen",
    "partregionName":null,
    "autoRefreshSec":3600,
    "fetchedAt":"2025-11-09T17:58:36.017Z",
    "initialFetch":false
  },
  "_msgid":"05e170f7b7b9f15f"
}
```

---

## 💡 Tips

- Use the dropdowns to easily select your desired region and subregion without needing to know IDs.  
- Set Auto-Refresh to a positive number (seconds) to keep pollen data updated automatically.  
- For detailed area information visit the official DWD pollen hazard index regions page:  
  https://www.dwd.de/DE/leistungen/gefahrenindizespollen/Gebiete.html
- Informat

---

## 📡 Data Source

This node uses the official Deutscher Wetterdienst (DWD) Open Data feed `s31fg.json` for pollen hazard indices. 
URL to Data source: https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json

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
    "id":"fb13b9cb3a2b49be",
    "type":"dwd-pollen",
    "z":"9b8a26582f09a98b",
    "name":"",
    "regionId":"40",
    "partregionId":"41",
    "regionName":"Nordrhein-Westfalen",
    "partregionName":"",
    "fetchOnDeploy":true,
    "autoRefreshSec":"3600",
    "x":250,
    "y":120,
    "wires":[
      [
        "6d04249e285bc20b"
      ]
    ]
  },
  {
    "id":"6d04249e285bc20b",
    "type":"debug",
    "z":"9b8a26582f09a98b",
    "name":"debug 1",
    "active":true,
    "tosidebar":true,
    "console":false,
    "tostatus":false,
    "complete":"true",
    "targetType":"full",
    "statusVal":"",
    "statusType":"auto",
    "x":500,
    "y":120,
    "wires":[

    ]
  },
  {
    "id":"8794b4f80223853a",
    "type":"inject",
    "z":"9b8a26582f09a98b",
    "name":"",
    "props":[
      {
        "p":"payload"
      },
      {
        "p":"topic",
        "vt":"str"
      }
    ],
    "repeat":"",
    "crontab":"",
    "once":false,
    "onceDelay":0.1,
    "topic":"",
    "payload":"",
    "payloadType":"date",
    "x":100,
    "y":120,
    "wires":[
      [
        "fb13b9cb3a2b49be"
      ]
    ]
  },
  {
    "id":"7cbd752df1d14dab",
    "type":"global-config",
    "env":[

    ],
    "modules":{
      "node-red-contrib-dwd-pollen":"1.0.3"
    }
  }
]
```

---

> ⚠️ **node-red-contrib-dwd-pollen** — bringing official DWD pollen index directly into your Node-RED flows.
</file>
