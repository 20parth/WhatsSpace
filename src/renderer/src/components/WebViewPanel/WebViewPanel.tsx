import { useEffect, useRef } from 'react'
import { Account } from '../../types'
import './WebViewPanel.css'

const WA_URL = 'https://web.whatsapp.com'
const WA_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

interface Props {
  accounts: Account[]
  activeId: string | null
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

    const handler = (e: Event) => {
      const title = (e as CustomEvent & { title?: string }).title ?? ''
      onUnreadChange(parseUnread(title))
    }

    el.addEventListener('page-title-updated', handler)
    return () => el.removeEventListener('page-title-updated', handler)
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

export default function WebViewPanel({ accounts, activeId, onUnreadChange }: Props) {
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
    <main className="webview-panel">
      {accounts.map((account) => (
        <WebViewItem
          key={account.id}
          account={account}
          visible={account.id === activeId}
          onUnreadChange={(count) => onUnreadChange(account.id, count)}
        />
      ))}
    </main>
  )
}
