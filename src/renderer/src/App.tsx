import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import WebViewPanel from './components/WebViewPanel/WebViewPanel'
import SettingsModal from './components/Settings/SettingsModal'
import { Account, Settings, DEFAULT_SETTINGS } from './types'
import { generateId, sortAccounts, DEFAULT_ACCOUNTS } from './utils'

function resolveTheme(theme: Settings['theme']): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const accountsRef = useRef<Account[]>([])

  useEffect(() => {
    accountsRef.current = accounts
  }, [accounts])

  // Load accounts and settings on mount
  useEffect(() => {
    Promise.all([
      window.electronAPI.getAccounts(),
      window.electronAPI.getSettings(),
    ]).then(([stored, storedSettings]) => {
      if (stored && stored.length > 0) {
        setAccounts(stored)
        setActiveId(sortAccounts(stored)[0].id)
      } else {
        const initial = DEFAULT_ACCOUNTS.map((a) => ({ ...a, id: generateId() }))
        setAccounts(initial)
        setActiveId(initial[0].id)
      }
      setSettingsState(storedSettings)
      setLoaded(true)
    })
  }, [])

  // Apply theme to document
  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolveTheme(settings.theme))
    }
    apply()

    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [settings.theme])

  // Persist accounts when changed
  useEffect(() => {
    if (!loaded) return
    window.electronAPI.setAccounts(accounts)
  }, [accounts, loaded])

  // Update tray badge when unread counts change
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((s, n) => s + n, 0)
    window.electronAPI.updateBadge(total)
  }, [unreadCounts])

  // Keyboard shortcuts via Electron main process
  useEffect(() => {
    window.electronAPI.onSwitchAccount((index) => {
      const sorted = sortAccounts(accountsRef.current)
      if (sorted[index]) setActiveId(sorted[index].id)
    })
  }, [])

  const saveSettings = useCallback(async (next: Settings) => {
    setSettingsState(next)
    await window.electronAPI.setSettings(next)
  }, [])

  const addAccount = useCallback((name: string, emoji: string, color: string) => {
    setAccounts((prev) => {
      const newAccount: Account = {
        id: generateId(),
        name,
        emoji,
        color,
        order: prev.length,
        pinned: false,
      }
      setActiveId(newAccount.id)
      return [...prev, newAccount]
    })
  }, [])

  const renameAccount = useCallback(
    (id: string, name: string, emoji: string, color: string) => {
      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, name, emoji, color } : a)))
    },
    []
  )

  const deleteAccount = useCallback(
    (id: string) => {
      setAccounts((prev) => {
        const filtered = prev.filter((a) => a.id !== id)
        if (activeId === id) {
          setActiveId(sortAccounts(filtered)[0]?.id ?? null)
        }
        return filtered.map((a, i) => ({ ...a, order: i }))
      })
      setUnreadCounts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    },
    [activeId]
  )

  const togglePin = useCallback((id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)))
  }, [])

  const reorderAccounts = useCallback((reordered: Account[]) => {
    setAccounts(reordered.map((a, i) => ({ ...a, order: i })))
  }, [])

  const setUnread = useCallback((id: string, count: number) => {
    setUnreadCounts((prev) => ({ ...prev, [id]: count }))
  }, [])

  const sorted = sortAccounts(accounts)

  return (
    <div className="app">
      <Sidebar
        accounts={sorted}
        activeId={activeId}
        unreadCounts={unreadCounts}
        onSelect={setActiveId}
        onAdd={addAccount}
        onRename={renameAccount}
        onDelete={deleteAccount}
        onTogglePin={togglePin}
        onReorder={reorderAccounts}
        onOpenSettings={() => setShowSettings(true)}
      />
      <WebViewPanel accounts={accounts} activeId={activeId} onUnreadChange={setUnread} />
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
