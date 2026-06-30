import { Account } from './types'

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function sortAccounts(accounts: Account[]): Account[] {
  return [...accounts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return a.order - b.order
  })
}

export const EMOJI_OPTIONS = [
  '👤', '🏢', '❤️', '💼', '🛒', '🌟', '🎯', '📱',
  '🔑', '🎨', '🌍', '🚀', '💡', '🎓', '🏠', '✈️',
]

export const COLOR_OPTIONS = [
  '#25D366', '#128C7E', '#075E54', '#34B7F1',
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#C77DFF', '#FF9F43', '#EE5A24', '#9B59B6',
]

export const DEFAULT_ACCOUNTS: Omit<Account, 'id'>[] = [
  { name: 'Personal', emoji: '👤', color: '#25D366', order: 0, pinned: false },
  { name: 'Work', emoji: '🏢', color: '#128C7E', order: 1, pinned: false },
]

export const IS_MAC = navigator.platform.includes('Mac')
export const MOD_KEY = IS_MAC ? '⌘' : 'Ctrl+'
