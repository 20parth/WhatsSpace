import { useState } from 'react'
import { Account } from '../../types'
import AccountItem from './AccountItem'
import AddAccountModal from './AddAccountModal'
import Icon from '../Icon/Icon'
import './Sidebar.css'

interface Props {
  accounts: Account[]
  activeId: string | null
  unreadCounts: Record<string, number>
  privacyMode: boolean
  onSelect: (id: string) => void
  onAdd: (name: string, icon: string, color: string) => void
  onRename: (id: string, name: string, icon: string, color: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onReorder: (accounts: Account[]) => void
  onOpenSettings: () => void
  onTogglePrivacy: () => void
}

export default function Sidebar({
  accounts,
  activeId,
  unreadCounts,
  privacyMode,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onTogglePin,
  onReorder,
  onOpenSettings,
  onTogglePrivacy,
}: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const filtered = collapsed
    ? accounts
    : search
    ? accounts.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : accounts

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return
    const from = accounts.findIndex((a) => a.id === draggingId)
    const to = accounts.findIndex((a) => a.id === targetId)
    const reordered = [...accounts]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    onReorder(reordered)
    setDraggingId(null)
    setDragOverId(null)
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <Icon name="message" size={20} color="var(--accent)" />
            <span className="logo-text">WhatsSpace</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} />
        </button>
      </div>

      {/* Search — hidden when collapsed */}
      {!collapsed && (
        <div className="sidebar-search-wrap">
          <Icon name="search" size={14} color="var(--text-secondary)" className="search-icon" />
          <input
            className="sidebar-search"
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Account list */}
      <div className="account-list">
        {!collapsed && filtered.length === 0 && search && (
          <p className="no-results">No accounts match "{search}"</p>
        )}
        {filtered.map((account, index) => (
          <AccountItem
            key={account.id}
            account={account}
            displayIndex={index}
            unreadCount={unreadCounts[account.id] ?? 0}
            collapsed={collapsed}
            isActive={account.id === activeId}
            isDragging={account.id === draggingId}
            isDragOver={account.id === dragOverId}
            onSelect={() => onSelect(account.id)}
            onRename={(name, icon, color) => onRename(account.id, name, icon, color)}
            onDelete={() => onDelete(account.id)}
            onTogglePin={() => onTogglePin(account.id)}
            onDragStart={() => setDraggingId(account.id)}
            onDragOver={() => setDragOverId(account.id)}
            onDrop={() => handleDrop(account.id)}
            onDragEnd={() => {
              setDraggingId(null)
              setDragOverId(null)
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="footer-icon-btn add-btn"
          onClick={() => setShowAdd(true)}
          title="Add account"
        >
          <Icon name="plus" size={16} />
          {!collapsed && <span className="footer-btn-label">Add Account</span>}
        </button>
        <button
          className={`footer-icon-btn privacy-btn ${privacyMode ? 'active' : ''}`}
          onClick={onTogglePrivacy}
          title={`Privacy mode (⌘⇧L) — ${privacyMode ? 'on' : 'off'}`}
        >
          <Icon name={privacyMode ? 'eye-off' : 'eye'} size={16} color={privacyMode ? 'var(--accent)' : 'currentColor'} />
        </button>
        <button
          className="footer-icon-btn"
          onClick={onOpenSettings}
          title="Settings"
        >
          <Icon name="settings" size={16} />
        </button>
      </div>

      {showAdd && (
        <AddAccountModal
          onAdd={(name, icon, color) => {
            onAdd(name, icon, color)
            setShowAdd(false)
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </aside>
  )
}
