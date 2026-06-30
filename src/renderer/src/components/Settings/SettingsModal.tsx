import { useState } from 'react'
import { Settings } from '../../types'
import './Settings.css'

interface Props {
  settings: Settings
  onSave: (s: Settings) => void
  onClose: () => void
}

export default function SettingsModal({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>({ ...settings })

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>⚙️ Settings</h2>

        <section className="settings-section">
          <div className="settings-section-title">Appearance</div>

          <div className="settings-row">
            <span className="settings-label">Theme</span>
            <div className="theme-toggle">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  className={`theme-btn ${draft.theme === t ? 'active' : ''}`}
                  onClick={() => set('theme', t)}
                >
                  {t === 'light' ? '☀️ Light' : t === 'dark' ? '🌙 Dark' : '💻 System'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">General</div>

          <label className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-label">Launch on startup</span>
              <span className="settings-desc">Open WhatsSpace when you log in</span>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={draft.launchOnStartup}
              onChange={(e) => set('launchOnStartup', e.target.checked)}
            />
          </label>

          <label className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-label">Close to tray</span>
              <span className="settings-desc">Keep running when the window is closed</span>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={draft.closeToTray}
              onChange={(e) => set('closeToTray', e.target.checked)}
            />
          </label>

          <label className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-label">Minimize to tray</span>
              <span className="settings-desc">Hide window when minimized</span>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={draft.minimizeToTray}
              onChange={(e) => set('minimizeToTray', e.target.checked)}
            />
          </label>
        </section>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="credits-block">
          <div className="credits-app">
            <span className="credits-icon">💬</span>
            <div>
              <div className="credits-app-name">WhatsSpace</div>
              <div className="credits-version">v0.1.0</div>
            </div>
          </div>
          <div className="credits-line">
            Designed &amp; built by{' '}
            <span className="credits-author">Parth Bhawar</span>
          </div>
          <div className="credits-line credits-sub">
            Multi-account WhatsApp Web for desktop
          </div>
        </div>
      </div>
    </div>
  )
}
