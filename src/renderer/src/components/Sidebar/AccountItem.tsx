import { useState } from 'react'
import { Account } from '../../types'
import { MOD_KEY } from '../../utils'
import AddAccountModal from './AddAccountModal'

interface Props {
  account: Account
  displayIndex: number
  unreadCount: number
  isActive: boolean
  isDragging: boolean
  isDragOver: boolean
  onSelect: () => void
  onRename: (name: string, emoji: string, color: string) => void
  onDelete: () => void
  onTogglePin: () => void
  onDragStart: () => void
  onDragOver: () => void
  onDrop: () => void
  onDragEnd: () => void
}

export default function AccountItem({
  account,
  displayIndex,
  unreadCount,
  isActive,
  isDragging,
  isDragOver,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: Props) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
  }

  const closeMenu = () => setMenuPos(null)

  return (
    <>
      <div
        className={[
          'account-item',
          isActive ? 'active' : '',
          isDragging ? 'dragging' : '',
          isDragOver ? 'drag-over' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        draggable
        onClick={onSelect}
        onContextMenu={handleContextMenu}
        onDragStart={onDragStart}
        onDragOver={(e) => {
          e.preventDefault()
          onDragOver()
        }}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
        <div className="account-avatar" style={{ backgroundColor: account.color }}>
          <span>{account.emoji}</span>
        </div>
        <div className="account-info">
          <span className="account-name">{account.name}</span>
          {account.pinned && <span className="pin-badge" title="Pinned">📌</span>}
        </div>
        {unreadCount > 0 ? (
          <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        ) : (
          displayIndex < 9 && (
            <span className="account-shortcut">{MOD_KEY}{displayIndex + 1}</span>
          )
        )}
      </div>

      {menuPos && (
        <div className="context-menu-overlay" onClick={closeMenu}>
          <div
            className="context-menu"
            style={{ left: menuPos.x, top: menuPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowEdit(true)
                closeMenu()
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                onTogglePin()
                closeMenu()
              }}
            >
              {account.pinned ? '📌 Unpin' : '📌 Pin'}
            </button>
            <div className="context-divider" />
            <button
              className="danger"
              onClick={() => {
                onDelete()
                closeMenu()
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <AddAccountModal
          initial={account}
          onAdd={(name, emoji, color) => {
            onRename(name, emoji, color)
            setShowEdit(false)
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
