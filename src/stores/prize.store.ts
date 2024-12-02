import { defineStore } from 'pinia'
import type { PrizeData } from '~/types/prize.d'

interface IPrizeStore {
  items: Array<PrizeData>
}

export const usePrizeStore = defineStore('prize.store', () => {
  const prize = useLocalStorage<IPrizeStore>('prize', { items: [] })

  function addPrize(item: PrizeData) {
    item.usage = 0
    prize.value?.items.push(item)
  }

  function removePrize(id: string) {
    const idx = prize.value?.items.findIndex((item) => item.id === id) ?? -1
    if (idx < 0) return
    prize.value!.items.splice(idx, 1)
  }

  function updatePrize(id: string, value: PrizeData) {
    const idx = prize.value?.items.findIndex((item) => item.id === id) ?? -1
    if (idx < 0) return
    if (typeof value.usage === 'undefined') value.usage = 0
    prize.value!.items[idx] = value
  }

  function moveUp(id: string) {
    const idx = prize.value?.items.findIndex((item) => item.id === id) ?? -1
    if (idx < 0) return
    const tmp = JSON.parse(JSON.stringify(prize.value!.items[idx]))
    prize.value!.items.splice(idx, 1)
    prize.value!.items.splice(Math.max(0, idx - 1), 0, tmp)
  }

  function moveDown(id: string) {
    console.log('move down ---', id)
    const idx = prize.value?.items.findIndex((item) => item.id === id) ?? -1
    console.log(idx)
    if (idx < 0) return
    const tmp = JSON.parse(JSON.stringify(prize.value!.items[idx]))
    prize.value!.items.splice(idx, 1)
    prize.value!.items.splice(idx + 1, 0, tmp)
  }

  function resetFirst() {
    prize.value?.items.forEach((item) => {
      item.is_first = false
      return
    })
  }

  function resetUsage() {
    prize.value?.items.forEach((item) => {
      item.usage = 0
      return
    })
  }

  function addFirst(id: string, value: boolean) {
    const idx = prize.value?.items.findIndex((item) => item.id === id) ?? -1
    if (idx < 0) return
    if (value) prize.value!.items[idx].is_first = value
  }

  function load(data: Array<PrizeData>) {
    prize.value!.items = data
  }

  return {
    prize,
    addPrize,
    removePrize,
    updatePrize,
    resetFirst,
    addFirst,
    moveUp,
    moveDown,
    resetUsage,
    load,
  }
})
