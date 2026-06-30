# WhatsSpace

A multi-account WhatsApp Web desktop app built with Electron. Run multiple WhatsApp accounts side by side, each in its own fully isolated session.

![WhatsSpace](https://raw.githubusercontent.com/parthrb/whatsspace/main/assets/preview.png)

> **Disclaimer:** WhatsSpace is an unofficial, community-built desktop wrapper for [WhatsApp Web](https://web.whatsapp.com). It is not affiliated with, endorsed by, or connected to Meta or WhatsApp in any way.

---

## Features

- **Multiple accounts** — Add as many WhatsApp accounts as you need, each completely isolated (separate cookies, storage, and sessions)
- **Keyboard switching** — Jump between accounts with `Cmd/Ctrl + 1–9`
- **Collapsible sidebar** — Expand for names and search, collapse to a slim icon rail
- **Unread badges** — Per-account unread counts with a system-level dock/taskbar badge
- **Desktop notifications** — Native notifications from every account
- **System tray** — Minimize or close to tray; WhatsSpace keeps running in the background
- **Light / Dark / System theme** — Follows your OS or set it manually
- **Custom account icons** — 12 SVG icons and 12 colors to tell accounts apart at a glance
- **External links & PDFs** — URLs and file downloads open in your system default app
- **Launch on startup** — Optional auto-start with your system

---

## Download

> Releases coming soon. For now, build from source below.

---

## Build from source

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later

### Setup

```bash
git clone https://github.com/parthrb/whatsspace.git
cd whatsspace
npm install
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build        # compile only
npm run build:mac    # macOS .dmg + .pkg
npm run build:win    # Windows .exe (NSIS) + .msi
```

Output is placed in the `dist/` folder.

---

## Tech stack

| Layer | Technology |
|---|---|
| Shell | Electron 31 |
| UI | React 18 + TypeScript |
| Build | electron-vite + Vite 5 |
| Persistence | electron-store 8 |
| Packaging | electron-builder 24 |

Session isolation is achieved via Electron's `persist:` partition API — each account gets its own sandboxed cookie jar, localStorage, and IndexedDB with zero custom code.

---

## Contributing

Issues and pull requests are welcome. For large changes, open an issue first to discuss the approach.

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [Parth Bhawar](https://parthrb.dev)
