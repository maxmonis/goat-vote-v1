class LocalStorageService {
  private storageKey = process.env.REACT_APP_LOCAL_STORAGE_KEY
  private getFullKey = (key: string) => this.storageKey + key

  get(key: string): unknown {
    const res = localStorage.getItem(this.getFullKey(key))
    return res ? JSON.parse(res) : null
  }

  set(key: string, payload: unknown) {
    localStorage.setItem(this.getFullKey(key), JSON.stringify(payload))
  }

  remove(key: string) {
    localStorage.remove(this.getFullKey(key))
  }

  clear() {
    localStorage.clear()
  }
}

export default LocalStorageService
