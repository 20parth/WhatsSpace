export interface Account {
  id: string
  name: string
  emoji: string
  color: string
  order: number
  pinned: boolean
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  launchOnStartup: boolean
  closeToTray: boolean
  minimizeToTray: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  launchOnStartup: false,
  closeToTray: true,
  minimizeToTray: false,
}

export interface ElectronAPI {
  getAccounts: () => Promise<Account[]>
  setAccounts: (accounts: Account[]) => Promise<void>
  onSwitchAccount: (cb: (index: number) => void) => void
  getSettings: () => Promise<Settings>
  setSettings: (settings: Settings) => Promise<void>
  updateBadge: (count: number) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
