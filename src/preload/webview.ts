import { ipcRenderer } from 'electron'

function sendExternal(url: string): void {
  ipcRenderer.sendToHost('open-external', url)
}

// Intercept window.open() — WhatsApp Web uses this for link confirmation dialogs
const _open = window.open.bind(window)
;(window as Window).open = function (
  url?: string | URL,
  target?: string,
  features?: string
): WindowProxy | null {
  const href = typeof url === 'string' ? url : (url as URL)?.toString() ?? ''
  if (href.startsWith('http://') || href.startsWith('https://')) {
    sendExternal(href)
    return null
  }
  return _open(url as string, target, features)
}

// Intercept <a> clicks as a fallback (capture phase so it fires before WhatsApp's handlers)
document.addEventListener(
  'click',
  (e) => {
    let el = e.target as HTMLElement | null
    while (el) {
      if (el.tagName === 'A') {
        const href = (el as HTMLAnchorElement).href
        if (
          href &&
          !href.startsWith('https://web.whatsapp.com') &&
          (href.startsWith('http://') || href.startsWith('https://'))
        ) {
          e.preventDefault()
          e.stopImmediatePropagation()
          sendExternal(href)
        }
        break
      }
      el = el.parentElement
    }
  },
  true
)
