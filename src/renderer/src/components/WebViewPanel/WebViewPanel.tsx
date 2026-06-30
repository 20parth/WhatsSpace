import { useEffect, useRef } from 'react'
import { Account } from '../../types'
import Icon from '../Icon/Icon'
import './WebViewPanel.css'

const WA_URL = 'https://web.whatsapp.com'
const WA_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

interface Props {
  accounts: Account[]
  activeId: string | null
  privacyMode: boolean
  onUnreadChange: (id: string, count: number) => void
}

function parseUnread(title: string): number {
  const m = title.match(/^\((\d+)\)/)
  return m ? parseInt(m[1], 10) : 0
}

function WebViewItem({
  account,
  visible,
  onUnreadChange,
}: {
  account: Account
  visible: boolean
  onUnreadChange: (count: number) => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onTitleUpdate = (e: Event) => {
      const title = (e as CustomEvent & { title?: string }).title ?? ''
      onUnreadChange(parseUnread(title))
    }

    // Fired when the webview calls window.open() or clicks a target="_blank" link.
    // This is the primary intercept for WhatsApp link clicks.
    const onNewWindow = (e: Event) => {
      const url = (e as CustomEvent & { url?: string }).url ?? ''
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.electronAPI.openExternal(url)
      }
    }

    // Fired when the webview itself navigates (e.g. direct href without target="_blank").
    // We can't prevent it from the renderer, but we open it externally as well.
    const onWillNavigate = (e: Event) => {
      const url = (e as CustomEvent & { url?: string }).url ?? ''
      if (url && !url.startsWith('https://web.whatsapp.com')) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          window.electronAPI.openExternal(url)
        }
      }
    }

    el.addEventListener('page-title-updated', onTitleUpdate)
    el.addEventListener('new-window', onNewWindow)
    el.addEventListener('will-navigate', onWillNavigate)

    return () => {
      el.removeEventListener('page-title-updated', onTitleUpdate)
      el.removeEventListener('new-window', onNewWindow)
      el.removeEventListener('will-navigate', onWillNavigate)
    }
  }, [onUnreadChange])

  return (
    <div className={`webview-container ${visible ? 'visible' : 'hidden'}`}>
      <webview
        ref={ref as React.RefObject<HTMLElement>}
        src={WA_URL}
        partition={`persist:whatsspace-${account.id}`}
        useragent={WA_UA}
        allowpopups
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default function WebViewPanel({ accounts, activeId, privacyMode, onUnreadChange }: Props) {
  if (accounts.length === 0) {
    return (
      <main className="webview-panel empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>No accounts yet</h2>
          <p>Add a WhatsApp account from the sidebar to get started.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={`webview-panel${privacyMode ? ' privacy' : ''}`}>
      {accounts.map((account) => (
        <WebViewItem
          key={account.id}
          account={account}
          visible={account.id === activeId}
          onUnreadChange={(count) => onUnreadChange(account.id, count)}
        />
      ))}
      {privacyMode && (
        <div className="privacy-overlay">
          <Icon name="eye-off" size={36} color="var(--text-secondary)" />
          <span className="privacy-label">Privacy Mode</span>
          <span className="privacy-hint">Press ⌘⇧L or click the eye icon to disable</span>
        </div>
      )}
    </main>
  )
}
