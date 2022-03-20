const PREFIX = 'goat-vote_'

class LocalStorageService {
  get(key: string): unknown {
    return JSON.parse(localStorage.getItem(PREFIX + key) || '')
  }

  set(key: string, payload: unknown) {
    localStorage.setItem(PREFIX + key, JSON.stringify(payload))
  }

  remove(key: string) {
    localStorage.remove(PREFIX + key)
  }

  clear() {
    localStorage.clear()
  }
}

export default LocalStorageService
