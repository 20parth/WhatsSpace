import { useState } from 'react'
import { Account } from '../../types'
import { MOD_KEY } from '../../utils'
import { DEFAULT_ICON } from '../../utils'
import Icon from '../Icon/Icon'
import AddAccountModal from './AddAccountModal'

interface Props {
  account: Account
  displayIndex: number
  unreadCount: number
  collapsed: boolean
  isActive: boolean
  isDragging: boolean
  isDragOver: boolean
  onSelect: () => void
  onRename: (name: string, icon: string, color: string) => void
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
  collapsed,
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

  const iconName = account.emoji || DEFAULT_ICON

  return (
    <>
      <div
        className={[
          'account-item',
          isActive ? 'active' : '',
          isDragging ? 'dragging' : '',
          isDragOver ? 'drag-over' : '',
          collapsed ? 'collapsed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        draggable
        title={collapsed ? account.name : undefined}
        onClick={onSelect}
        onContextMenu={handleContextMenu}
        onDragStart={onDragStart}
        onDragOver={(e) => { e.preventDefault(); onDragOver() }}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
        <div className="avatar-wrapper">
          <div className="account-avatar" style={{ backgroundColor: account.color }}>
            <Icon name={iconName} size={17} color="white" strokeWidth={2} />
          </div>
          {collapsed && unreadCount > 0 && <span className="unread-dot" />}
        </div>

        {!collapsed && (
          <>
            <div className="account-info">
              <span className="account-name">{account.name}</span>
              {account.pinned && (
                <Icon name="pin" size={10} color="var(--text-secondary)" />
              )}
            </div>
            {unreadCount > 0 ? (
              <span className="unread-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : (
              displayIndex < 9 && (
                <span className="account-shortcut">
                  {MOD_KEY}{displayIndex + 1}
                </span>
              )
            )}
          </>
        )}
      </div>

      {menuPos && (
        <div className="context-menu-overlay" onClick={closeMenu}>
          <div
            className="context-menu"
            style={{ left: menuPos.x, top: menuPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { setShowEdit(true); closeMenu() }}>
              <Icon name="edit" size={14} /> Edit
            </button>
            <button onClick={() => { onTogglePin(); closeMenu() }}>
              <Icon name="pin" size={14} /> {account.pinned ? 'Unpin' : 'Pin'}
            </button>
            <div className="context-divider" />
            <button className="danger" onClick={() => { onDelete(); closeMenu() }}>
              <Icon name="trash" size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <AddAccountModal
          initial={account}
          onAdd={(name, icon, color) => {
            onRename(name, icon, color)
            setShowEdit(false)
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
