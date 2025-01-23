import type {
  IVerifyUserResponse,
  IVerifyUserRequestBody,
  IGameLoggerRequestBody,
  IGameLoggerResponse,
} from '~/types/api'
import { useNuxtApp } from '#app'
import { ref, child, get, update  ,push, set} from 'firebase/database'
import { useUserStore } from '~/stores/user.store'


export const useApi = () => {
  const verifyUser = async (link: string, gameId: number): Promise<IVerifyUserResponse> => {
    const body: IVerifyUserRequestBody = {
      link,
      game_id: gameId,
    }
    const result = await $fetch<IVerifyUserResponse>(
      'https://townhall.peepshare.me/api/v1/user/event/game/check/play',
      {
        method: 'POST',
        body,
      }
    )
    return result
  }

  const addGameLogger = async (empId: number, gameId: number, reward: string): Promise<IGameLoggerResponse> => {
    const body: IGameLoggerRequestBody = {
      emp_id: empId,
      game_id: gameId,
      reward,
    }
    const result = await $fetch<IGameLoggerResponse>(
      'https://townhall.peepshare.me/api/v1/user/event/game/reward/save',
      {
        method: 'POST',
        body,
      }
    )
    return result
  }

 const getPrizeFirebase = async (): Promise<any> => {
  const { $database } = useNuxtApp()
  const dbRef = ref($database)
  try {
    const snapshot = await get(child(dbRef, 'prize'))
    if (snapshot.exists()) {
      const items = snapshot.val()
      return items
    } else {
      console.log('No data available')
      return null
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const removePrizeItemByKey = async (key: string): Promise<void> => {
  const { $database } = useNuxtApp()
  const dbRef = ref($database, 'prize/items')
  try {
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      const items = snapshot.val()
      const index = items.findIndex((item: any) => item.id === key)
      if (index !== -1) {
        items.splice(index, 1) // ลบรายการที่มี id ตรงกับ key
        await update(ref($database, 'prize'), { items }) // อัปเดตข้อมูลในฐานข้อมูล
        console.log(`Item with key ${key} has been removed`)
      } else {
        console.log('No item found with the provided key')
      }
    } else {
      console.log('No data available')
    }
  } catch (error) {
    console.error('Error removing item:', error)
  }
  
}
const addPrizeItem = async (item: any): Promise<void> => {
  const { $database } = useNuxtApp()
  const dbRef = ref($database, 'prize/items')
  try {
    await push(dbRef, item)
    console.log('Item has been added')
  } catch (error) {
    console.error('Error adding item:', error)
  }
}
const addPrizeItemWithIndex = async (item: any): Promise<void> => {
  const { $database } = useNuxtApp()
  const dbRef = ref($database, 'prize/items')
  try {
    const snapshot = await get(dbRef)
    let newIndex = 1
    if (snapshot.exists()) {
      const items = snapshot.val()
      const keys = Object.keys(items)
      console.log('keys:', keys)
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1]
        const lastIndex = lastKey
        newIndex = Number(lastIndex) + 1
      }
    }
    const newItemRef = ref($database, `prize/items/${newIndex}`)
    await set(newItemRef, item)
    console.log('Item has been added with index:', newIndex)
  } catch (error) {
    console.error('Error adding item with index:', error)
  }
}
const updatePrizeItemById = async (id: string, updatedItem: any): Promise<void> => {
  const { $database } = useNuxtApp()
  const itemRef = ref($database, `prize/items/${id}`)
  console.log({id , updatedItem})
  try {
    await update(itemRef, updatedItem)
    console.log(`Item with id ${id} has been updated`)
  } catch (error) {
    console.error('Error updating item:', error)
  }
}

  return { verifyUser, addGameLogger , getPrizeFirebase , removePrizeItemByKey ,addPrizeItem ,addPrizeItemWithIndex , updatePrizeItemById }
}


