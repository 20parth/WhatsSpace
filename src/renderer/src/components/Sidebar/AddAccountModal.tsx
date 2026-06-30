import { useState } from 'react'
import { Account } from '../../types'
import { COLOR_OPTIONS, DEFAULT_ICON } from '../../utils'
import Icon, { ACCOUNT_ICON_NAMES, IconName } from '../Icon/Icon'
import './Modal.css'

interface Props {
  initial?: Account
  onAdd: (name: string, icon: string, color: string) => void
  onClose: () => void
}

export default function AddAccountModal({ initial, onAdd, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState<IconName>(
    (initial?.emoji as IconName) ?? DEFAULT_ICON
  )
  const [color, setColor] = useState(initial?.color ?? '#25D366')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), icon, color)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <div className="modal-preview" style={{ backgroundColor: color }}>
            <Icon name={icon} size={20} color="white" strokeWidth={2} />
          </div>
          <h2>{initial ? 'Edit Account' : 'New Account'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Personal, Work, Business..."
              maxLength={30}
            />
          </div>

          <div className="form-row">
            <label>Icon</label>
            <div className="icon-grid">
              {ACCOUNT_ICON_NAMES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`icon-btn ${icon === n ? 'selected' : ''}`}
                  onClick={() => setIcon(n)}
                  title={n}
                >
                  <Icon name={n} size={18} strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label>Color</label>
            <div className="color-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-btn ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">
              {initial ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
