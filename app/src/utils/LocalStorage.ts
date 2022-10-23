type Key = "access-token" | "preferred-lng" | "prefers-dark"

class LocalStorage {
  private readonly key: string

  constructor(key: Key) {
    this.key = `goat-vote_${key}`
  }

  public get<T>(): T | null {
    const item = localStorage.getItem(this.key)
    return item ? JSON.parse(item) : null
  }

  public set<T>(item: T) {
    localStorage.setItem(this.key, JSON.stringify(item))
  }

  public remove() {
    localStorage.removeItem(this.key)
  }
}

export default LocalStorage
