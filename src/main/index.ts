import {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell,
  Menu,
  Tray,
  nativeImage,
} from 'electron'
import { join } from 'path'
import Store from 'electron-store'

interface Account {
  id: string
  name: string
  emoji: string
  color: string
  order: number
  pinned: boolean
}

interface Settings {
  theme: 'light' | 'dark' | 'system'
  launchOnStartup: boolean
  closeToTray: boolean
  minimizeToTray: boolean
}

interface StoreSchema {
  accounts: Account[]
  settings: Settings
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  launchOnStartup: false,
  closeToTray: true,
  minimizeToTray: false,
}

const store = new Store<StoreSchema>()
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function createTrayIcon(size = 22): Electron.NativeImage {
  const data = Buffer.alloc(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 1.5

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const idx = (y * size + x) * 4
      if (dist <= r) {
        if (process.platform === 'darwin') {
          data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255; data[idx + 3] = 255
        } else {
          data[idx] = 37; data[idx + 1] = 211; data[idx + 2] = 102; data[idx + 3] = 255
        }
      }
    }
  }

  const img = nativeImage.createFromBuffer(data, { width: size, height: size })
  if (process.platform === 'darwin') img.setTemplateImage(true)
  return img
}

function updateBadge(count: number): void {
  if (process.platform === 'darwin') {
    app.dock.setBadge(count > 0 ? String(count) : '')
  }
  tray?.setToolTip(count > 0 ? `WhatsSpace — ${count} unread` : 'WhatsSpace')
}

function createTray(): void {
  tray = new Tray(createTrayIcon())
  tray.setToolTip('WhatsSpace')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show WhatsSpace',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })

  tray.on('double-click', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 860,
    minHeight: 560,
    show: false,
    title: 'WhatsSpace',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  })

  Menu.setApplicationMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.on('close', (e) => {
    const settings = store.get('settings', DEFAULT_SETTINGS)
    if (!isQuitting && settings.closeToTray) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('minimize', () => {
    const settings = store.get('settings', DEFAULT_SETTINGS)
    if (settings.minimizeToTray) {
      mainWindow?.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Grant notification permission to all webviews
app.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    contents.session.setPermissionRequestHandler((_wc, permission, cb) => {
      cb(['notifications', 'media', 'audioCapture'].includes(permission))
    })
  }
})

function registerShortcuts(): void {
  for (let i = 1; i <= 9; i++) {
    globalShortcut.register(`CmdOrCtrl+${i}`, () => {
      mainWindow?.webContents.send('switch-account', i - 1)
    })
  }
}

ipcMain.handle('accounts:get', () => store.get('accounts', []))
ipcMain.handle('accounts:set', (_event, accounts: Account[]) => {
  store.set('accounts', accounts)
})

ipcMain.handle('settings:get', () => store.get('settings', DEFAULT_SETTINGS))
ipcMain.handle('settings:set', (_event, settings: Settings) => {
  store.set('settings', settings)
  app.setLoginItemSettings({ openAtLogin: settings.launchOnStartup })
})

ipcMain.on('badge:update', (_event, count: number) => {
  updateBadge(count)
})

app.whenReady().then(() => {
  createWindow()
  createTray()
  registerShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else mainWindow?.show()
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
