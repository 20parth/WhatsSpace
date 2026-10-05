import { useEffect, useState } from 'react'
import Icon from '../Icon/Icon'
import './About.css'

declare const __APP_VERSION__: string
declare const __GITHUB_REPO__: string

interface Release {
  tag_name: string
  published_at: string
  html_url: string
  body: string
}

interface Props {
  onClose: () => void
}

export default function AboutModal({ onClose }: Props) {
  const [release, setRelease] = useState<Release | null>(null)
  const [releaseError, setReleaseError] = useState(false)

  useEffect(() => {
    fetch('https://api.github.com/repos/20parth/WhatsSpace/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.tag_name) setRelease(data as Release)
        else setReleaseError(true)
      })
      .catch(() => setReleaseError(true))
  }, [])

  function openExternal(url: string) {
    window.electronAPI.openExternal(url)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal about-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="about-header">
          <div className="about-app-identity">
            <div className="about-icon-ring">
              <Icon name="message" size={22} color="var(--accent)" />
            </div>
            <div>
              <div className="about-app-name">WhatsSpace</div>
              <div className="about-version">v{__APP_VERSION__}</div>
            </div>
          </div>
          <button className="settings-close-btn" onClick={onClose} title="Close">
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Latest Release */}
        <div className="about-section">
          <div className="about-section-title">Latest Release</div>
          {release ? (
            <div className="about-release">
              <div className="about-release-tag">
                <span className="about-tag-badge">{release.tag_name}</span>
                <span className="about-release-date">{formatDate(release.published_at)}</span>
              </div>
              {release.body && (
                <p className="about-release-notes">{release.body.slice(0, 200)}{release.body.length > 200 ? '…' : ''}</p>
              )}
              <button
                className="about-link-btn"
                onClick={() => openExternal(release.html_url)}
              >
                View on GitHub
              </button>
            </div>
          ) : releaseError ? (
            <p className="about-muted">Could not fetch release info.</p>
          ) : (
            <p className="about-muted">Loading…</p>
          )}
        </div>

        {/* Privacy */}
        <div className="about-section">
          <div className="about-section-title">Privacy</div>
          <p className="about-body">
            WhatsSpace does not collect, store, or transmit any personal data. All sessions run
            locally on your device. No analytics, no telemetry, no accounts.
          </p>
        </div>

        {/* Terms */}
        <div className="about-section">
          <div className="about-section-title">Terms &amp; Disclaimer</div>
          <p className="about-body">
            WhatsApp® is a trademark of Meta Platforms, Inc. WhatsSpace is an independent
            open-source project and is not affiliated with, endorsed by, or associated with Meta.
            Use of this app is subject to{' '}
            <button className="about-inline-link" onClick={() => openExternal('https://www.whatsapp.com/legal/terms-of-service')}>
              WhatsApp's Terms of Service
            </button>
            .
          </p>
        </div>

        {/* Developer */}
        <div className="about-section about-developer">
          <div className="about-section-title">Developer</div>
          <div className="about-dev-row">
            <div className="about-dev-info">
              <span className="about-dev-name">Parth Bhawar</span>
              <div className="about-dev-links">
                <button className="about-link-btn" onClick={() => openExternal('https://parthrb.dev')}>
                  parthrb.dev
                </button>
                <span className="about-dot">·</span>
                <button className="about-link-btn" onClick={() => openExternal(__GITHUB_REPO__)}>
                  GitHub
                </button>
                <span className="about-dot">·</span>
                <button
                  className="about-link-btn"
                  onClick={() => openExternal(`${__GITHUB_REPO__}/blob/main/LICENSE`)}
                >
                  MIT License
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
