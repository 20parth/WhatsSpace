import { useState } from 'react'
import { Account } from '../../types'
import { EMOJI_OPTIONS, COLOR_OPTIONS } from '../../utils'
import './Modal.css'

interface Props {
  initial?: Account
  onAdd: (name: string, emoji: string, color: string) => void
  onClose: () => void
}

export default function AddAccountModal({ initial, onAdd, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '👤')
  const [color, setColor] = useState(initial?.color ?? '#25D366')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), emoji, color)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <div className="modal-preview" style={{ backgroundColor: color }}>
            <span>{emoji}</span>
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
            <div className="emoji-grid">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-btn ${emoji === e ? 'selected' : ''}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
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
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {initial ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
