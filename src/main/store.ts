import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

export class JsonStore<T extends Record<string, unknown>> {
  private _data: Partial<T> = {}
  private _filePath = ''

  private _load(): void {
    if (this._filePath) return
    const dir = app.getPath('userData')
    mkdirSync(dir, { recursive: true })
    this._filePath = join(dir, 'whatsspace-config.json')
    try {
      this._data = JSON.parse(readFileSync(this._filePath, 'utf-8'))
    } catch {
      this._data = {}
    }
  }

  get<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
    this._load()
    const val = this._data[key]
    return val !== undefined ? (val as T[K]) : defaultValue
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this._load()
    this._data[key] = value
    writeFileSync(this._filePath, JSON.stringify(this._data, null, 2), 'utf-8')
  }
}
