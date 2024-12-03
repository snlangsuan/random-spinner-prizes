import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

interface IHistoryStoreItem {
  id: string
  public_id: string
  name: string
  prize_id: string
  created_at: number
}

interface IHistoryStore {
  items: Array<IHistoryStoreItem>
}

export const useHistoryStore = defineStore('prize.history.store', () => {
  const history = useLocalStorage<IHistoryStore>('history.prize', { items: [] })

  function add(publicId: string, name: string, prizeId: string) {
    try {
      history.value?.items.push({
        id: uuidv4(),
        public_id: publicId,
        name,
        prize_id: prizeId,
        created_at: Date.now(),
      })
    } catch (_error) {
      console.error('not add history')
    }
  }

  function remove(id: string) {
    const idx = history.value?.items.findIndex((item) => item.id === id) ?? -1
    if (idx < 0) return
    history.value?.items.splice(idx, 1)
  }

  return { history, add, remove }
})
