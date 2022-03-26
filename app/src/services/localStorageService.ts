class LocalStorageService {
  private key: string

  constructor(key: string) {
    this.key = `goat-vote_${key}`
  }

  get(): unknown {
    const res = localStorage.getItem(this.key)
    return res ? JSON.parse(res) : null
  }

  set(payload: unknown) {
    localStorage.setItem(this.key, JSON.stringify(payload))
  }

  remove() {
    localStorage.removeItem(this.key)
  }

  clear() {
    localStorage.clear()
  }
}

export default LocalStorageService
