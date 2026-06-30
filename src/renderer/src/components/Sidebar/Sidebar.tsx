import { useState } from 'react'
import { Account } from '../../types'
import AccountItem from './AccountItem'
import AddAccountModal from './AddAccountModal'
import './Sidebar.css'

interface Props {
  accounts: Account[]
  activeId: string | null
  unreadCounts: Record<string, number>
  onSelect: (id: string) => void
  onAdd: (name: string, emoji: string, color: string) => void
  onRename: (id: string, name: string, emoji: string, color: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onReorder: (accounts: Account[]) => void
  onOpenSettings: () => void
}

export default function Sidebar({
  accounts,
  activeId,
  unreadCounts,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onTogglePin,
  onReorder,
  onOpenSettings,
}: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const filtered = search
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
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">💬</span>
          <span className="logo-text">WhatsSpace</span>
        </div>
        <input
          className="sidebar-search"
          type="text"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="account-list">
        {filtered.length === 0 && search && (
          <p className="no-results">No accounts match "{search}"</p>
        )}
        {filtered.map((account, index) => (
          <AccountItem
            key={account.id}
            account={account}
            displayIndex={index}
            unreadCount={unreadCounts[account.id] ?? 0}
            isActive={account.id === activeId}
            isDragging={account.id === draggingId}
            isDragOver={account.id === dragOverId}
            onSelect={() => onSelect(account.id)}
            onRename={(name, emoji, color) => onRename(account.id, name, emoji, color)}
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

      <div className="sidebar-footer">
        <button className="add-account-btn" onClick={() => setShowAdd(true)}>
          <span className="add-icon">＋</span>
          <span>Add Account</span>
        </button>
        <button className="settings-btn" onClick={onOpenSettings} title="Settings">
          ⚙️
        </button>
      </div>

      {showAdd && (
        <AddAccountModal
          onAdd={(name, emoji, color) => {
            onAdd(name, emoji, color)
            setShowAdd(false)
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </aside>
  )
}
