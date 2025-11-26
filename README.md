# node-red-contrib-dwd-pollen

A Node-RED node providing access to the official **DWD Pollenflugvorhersage** (pollen flight forecast) for 14 pollen types, with full internationalisation and a consistent interface shared with all DWD nodes.

---

## ✨ Features

- Official **DWD Pollenflugvorhersage** (pollen forecast index)
- Fully **i18n-enabled** (English / German)
- Localised help pages & editor labels
- Supports **14 DWD pollen types**
- Structured JSON output ideal for dashboards & scorecards
- Auto-refresh mode
- “Fetch on deploy” option
- Diagnostics mode for debugging
- Consistent API across all DWD-related nodes

---

## 📦 Install

From your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-dwd-pollen
```

Or via the Node-RED Palette Manager:

1. Open the Node-RED editor
2. Menu → **Manage palette**
3. Tab **Install**
4. Search for **`node-red-contrib-dwd-pollen`**
5. Click **Install**

---

## 🔧 Configuration

### Name
Optional display name for the node.

### Auto-refresh (sec)
If greater than `0`, the node fetches pollen data periodically.

### Fetch on deploy
When enabled, the node performs an initial fetch shortly after the flow is deployed.

### Diagnostics
Writes detailed debug information to the Node-RED log.

---

## 🔌 Inputs

Any incoming message triggers a fetch of pollen data using the current configuration.

---

## 📤 Outputs

The node outputs the DWD pollen levels in the following structure:

```json
{
  "timestamp": "2025-04-05T12:00:00Z",
  "region": "Germany",
  "pollen": {
    "hazel": 1,
    "alder": 2,
    "birch": 3,
    "grass": 0,
    "rye": 0,
    "mugwort": 1,
    "ragweed": 0,
    "ash": 2,
    "oak": 1,
    "beech": 0,
    "plane": 0,
    "maple": 1,
    "willow": 2,
    "poplar": 0
  }
}
```

Index values follow the DWD scale `0–3`.

---

## 🔎 Status text

The node reports its state using status messages:

- **loading…** – data is being fetched
- **ready** – idle, waiting for input or refresh
- **ok** – data successfully retrieved
- **error** – an error occurred

These messages are fully localised.

---

## 🌍 Internationalisation (i18n)

All editor labels, help pages, tooltips and runtime messages are translated via:

- `nodes/locales/en-US/dwd-pollen.json`
- `nodes/locales/de/dwd-pollen.json`

The help text is also localised:

- `nodes/locales/en-US/dwd-pollen.html`
- `nodes/locales/de/dwd-pollen.html`

The editor language controls which version is shown.

---

## 🧪 Example flow

A basic example flow is included in:

```
examples/dwd-pollen-basic.json
```

Import via:

1. Node-RED menu → **Import**
2. Choose **Clipboard**
3. Paste the JSON
4. Click **Import**

This flow demonstrates:

- Fetch-on-deploy
- Manual triggers
- Viewing results in Debug nodes

---

## 🗺️ Roadmap

Planned enhancements:

- Optional regional pollen data
- Historical pollen values
- Dashboard visualisation components
- Combined output for multi-day forecasts
- Additional pollen metadata and explanations

---

> ⚠️ **node-red-contrib-dwd-pollen** — bringing official DWD Pollenflugvorhersage directly into your Node-RED flows.

