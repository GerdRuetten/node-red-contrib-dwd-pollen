# node-red-contrib-dwd-pollen

Ein Node-RED-Node, der Zugriff auf die offizielle **DWD-Pollenflugvorhersage** für 14 Pollenarten bietet.  
Der Node ist vollständig internationalisiert, enthält lokalisierte Hilfetexte und folgt dem einheitlichen Interface der gesamten DWD-Node-Familie.

---

## ✨ Features

- Offizielle **DWD-Pollenflugvorhersage (Pollenflug-Gefahrenindex)**
- Vollständige **Internationalisierung (Deutsch / Englisch)**
- Lokalisierte Hilfeseiten & Editor-Beschriftungen
- Unterstützt **14 Pollenarten des DWD**
- Strukturierte JSON-Ausgabe – perfekt für Dashboards und Scorecards
- Auto-Refresh-Funktion
- „Beim Deploy abrufen“-Option
- Diagnosemodus zur Fehlersuche
- Einheitliches API-Design wie bei allen DWD-Nodes (Pollen, Forecast, Warnungen, Regenradar)

---

## 📦 Installation

Im Node-RED User-Verzeichnis (typisch `~/.node-red`):

```bash
npm install node-red-contrib-dwd-pollen
```

Oder über den Node-RED Paletten-Manager:

1. Öffne den Node-RED Editor
2. Menü → **Palette verwalten**
3. Tab **Installieren**
4. Suche nach **`node-red-contrib-dwd-pollen`**
5. Klicke **Installieren**

---

## 🔧 Konfiguration

### Name
Optionaler Anzeigename für den Node.

### Auto-Aktualisierung (Sek.)
Wenn Wert > `0`, ruft der Node die DWD-Pollendaten automatisch in Intervallen ab.

### Beim Deploy abrufen
Wenn aktiviert, führt der Node direkt nach dem Deploy einen ersten Abruf durch.

### Diagnose
Schreibt detaillierte Debug-Ausgaben ins Node-RED-Log — ideal beim Einrichten oder zur Fehlersuche.

---

## 🔌 Eingänge

Jede eingehende Nachricht löst einen neuen DWD-Pollenabruf aus (sofern Auto-Refresh deaktiviert ist).

---

## 📤 Ausgänge

Der Node gibt ein strukturiertes JSON im folgenden Format aus:

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

Die Werte folgen der DWD-Skala **0–3**.

---

## 🔎 Statusanzeigen

Der Node zeigt seinen aktuellen Zustand über Statusmeldungen an:

- **lade…** – Daten werden abgerufen
- **bereit** – Leerlauf / wartet auf Trigger
- **ok** – Daten erfolgreich geladen
- **Fehler** – Fehler beim Abrufen

Alle Statusmeldungen sind vollständig lokalisiert.

---

## 🌍 Internationalisierung (i18n)

Der Node nutzt das Node-RED Translator-Framework:

- Lokalisierte UI-Labels:
    - `nodes/locales/en-US/dwd-pollen.json`
    - `nodes/locales/de/dwd-pollen.json`

- Lokalisierte Hilfe-Texte:
    - `nodes/locales/en-US/dwd-pollen.html`
    - `nodes/locales/de/dwd-pollen.html`

Die Editor-Sprache bestimmt automatisch die angezeigte Version.

---

## 🧪 Beispiel-Flow

Ein Basis-Beispiel findet sich unter:

```
examples/dwd-pollen-basic.json
```

Import:

1. Node-RED Menü → **Importieren**
2. **Zwischenablage** wählen
3. JSON einfügen
4. **Importieren** klicken

Der Flow zeigt:

- Fetch-on-deploy
- Manuelle Triggerung über Inject-Node
- Debug-Ausgabe der Rohdaten

---

## 🗺️ Roadmap

Geplante Erweiterungen:

- Regionale Pollenwerte (z. B. nach Bundesland)
- Historische Verlaufsauswertung
- Dashboard-Komponenten (Scorecards, Diagramme)
- Multi-Tages-Pollenprognose
- Zusätzliche Metadaten (Blühbeginn / Blühende / Risikoindikationen)

---

> ⚠️ **node-red-contrib-dwd-pollen** — bringt die offizielle DWD-Pollenflugvorhersage direkt in deine Node-RED-Flows.
