import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAccounts: () => ipcRenderer.invoke('accounts:get'),
  setAccounts: (accounts: unknown) => ipcRenderer.invoke('accounts:set', accounts),
  onSwitchAccount: (cb: (index: number) => void) => {
    ipcRenderer.on('switch-account', (_event, index: number) => cb(index))
  },
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings: unknown) => ipcRenderer.invoke('settings:set', settings),
  updateBadge: (count: number) => ipcRenderer.send('badge:update', count),
  openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
})
