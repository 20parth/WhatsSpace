# WhatsSpace

A multi-account WhatsApp Web desktop app built with Electron. Run multiple WhatsApp accounts side by side, each in its own fully isolated session.

> **Disclaimer:** WhatsSpace is an unofficial, community-built desktop wrapper for [WhatsApp Web](https://web.whatsapp.com). It is not affiliated with, endorsed by, or connected to Meta or WhatsApp in any way.

---

## Download

| Platform | Link |
|---|---|
| macOS (Apple Silicon) | [WhatsSpace-arm64.dmg](https://github.com/20parth/WhatsSpace/releases/latest/download/WhatsSpace-1.1.1-arm64.dmg) |
| macOS (Intel) | [WhatsSpace-x64.dmg](https://github.com/20parth/WhatsSpace/releases/latest/download/WhatsSpace-1.1.1-x64.dmg) |
| Windows | [WhatsSpace-Setup.exe](https://github.com/20parth/WhatsSpace/releases/latest/download/WhatsSpace-Setup-1.1.1.exe) |

Or browse all releases → [github.com/20parth/WhatsSpace/releases](https://github.com/20parth/WhatsSpace/releases)

### macOS: "damaged and can't be opened"

macOS blocks unsigned apps downloaded from the internet. WhatsSpace is open-source and not yet notarized with Apple. To open it, run this once in Terminal after installing:

```bash
xattr -cr /Applications/WhatsSpace.app
```

Then double-click the app normally. Alternatively: right-click the app → **Open** → **Open** in the dialog.

---

## Features

- **Multiple accounts** — Add as many WhatsApp accounts as you need, each completely isolated (separate cookies, storage, and sessions)
- **Keyboard switching** — Jump between accounts with `Cmd/Ctrl + 1–9`
- **Privacy mode** — Blur all chats instantly with `Cmd/Ctrl + Shift + L`
- **Collapsible sidebar** — Expand for names and search, collapse to a slim icon rail
- **Unread badges** — Per-account unread counts with a system-level dock/taskbar badge
- **Desktop notifications** — Native notifications from every account
- **System tray** — Minimize or close to tray; WhatsSpace keeps running in the background
- **Light / Dark / System theme** — Follows your OS or set it manually
- **Custom account icons** — 12 icons and 12 colors to tell accounts apart at a glance
- **External links & file downloads** — Opens in your default browser/app
- **Launch on startup** — Optional auto-start with your system

---

## Build from source

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm 9 or later

### Setup

```bash
git clone https://github.com/20parth/WhatsSpace.git
cd WhatsSpace
npm install
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build && npx electron-builder --mac    # macOS .dmg
npm run build && npx electron-builder --win    # Windows .exe
```

Output is placed in the `dist/` folder.

---

## Tech stack

| Layer | Technology |
|---|---|
| Shell | Electron 44 |
| UI | React 18 + TypeScript |
| Build | electron-vite + Vite |
| Packaging | electron-builder 26 |

Session isolation is achieved via Electron's `persist:` partition API — each account gets its own sandboxed cookie jar, localStorage, and IndexedDB.

---

## Contributing

Issues and pull requests are welcome. For large changes, open an issue first to discuss the approach.

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [Parth Bhawar](https://parthrb.dev)
