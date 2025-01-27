<template>
  <v-container class="fill-height main-background" fluid>
    <v-row class="fill-height align-center justify-center">
      <div class="text-center" :style="{ marginTop: '-58px' }">
        <wheel-spinner
          v-if="items.length > 0"
          ref="spinner"
          v-model:playing="isPlaying"
          :data="items"
          :first="firstPrizeId"
          @end="handleOnSpinEnd"
        />
      </div>
    </v-row>
    <div class="text-caption" style="position: fixed; bottom: 8px; left: 8px">
      <!-- {{ barcode }} -->
      <v-progress-circular v-show="isReceivingText" color="primary" indeterminate />
    </div>
    <div style="position: fixed; bottom: 8px; right: 8px">
      <v-btn :disabled="isPlaying" variant="plain" icon @click="handleOnStartSpin">
        <v-icon>mdi-bug-play-outline</v-icon>
      </v-btn>
    </div>
    <prize-scene v-model="isPrizeShow" :prize="prizeDrop" />
    <main-info-dialog ref="infoDialogRef" v-model="isInfoShow" />
    <!-- <v-btn @click="() => handleOnProcessText('https://im.jts.co.th/profile/TgfNpiDB22')">test barcode</v-btn> -->
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate />
    </v-overlay>
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import { useHistoryStore } from '~/stores/history.store'
import MainInfoDialog from '~/components/MainInfoDialog.vue'
import { GAME_MESSAGE_CHANNEL } from '~/constants/game'
import type WheelSpinner from '~/components/WheelSpinner.vue'
import type { PrizeData } from '~/types/prize.d'
import type { IGameStage } from '~/types/game.d'
import type { IUserInfo } from '~/types/api'
import { v4 as uuidv4 } from 'uuid'

const prizeStore = usePrizeStore()
const historyStore = useHistoryStore()
const api = useApi()
const spinner = ref<InstanceType<typeof WheelSpinner>>()
const infoDialogRef = ref<InstanceType<typeof MainInfoDialog>>()
const isPlaying = ref<boolean>(false)
const items = ref<PrizeData[]>([])
// const items = computed(() => temp.value.length > 0 ? temp.value : [])
const channel = new BroadcastChannel(GAME_MESSAGE_CHANNEL)

let interval: ReturnType<typeof setInterval> | undefined = undefined
const barcode = ref<string>('')
const isReceivingText = ref<boolean>(false)
const isProcessing = ref<boolean>(false)
const isPrizeShow = ref<boolean>(false)
const isInfoShow = ref<boolean>(false)
const prizeDrop = ref<PrizeData>()
const isEmptyPrize = ref<boolean>(false)
const firstPrizeId = ref<string | undefined>()
const isLoading = ref<boolean>(false)
// const isEmptyPrize = computed(() => (prizeStore.prize?.items || []).filter((item) => item.usage < item.qty).length < 1)
// const firstPrizeId = computed(() => ((prizeStore.prize?.items || []).find((item) => item.is_first) || {}).id)

async function getPrize(empId: string, name: string): PrizeData | undefined {
  try {
    const prize = weightedRandom(items.value.filter((item) => item.usage < item.qty))
    if (!prize) {
      return
    }

    // prizeStore.updatePrize(prize.id, { ...prize, usage: prize.usage + 1 })
    // historyStore.add(empId, name, prize.id)
    const index = items.value.findIndex((item) => item.id === prize.id)
    await api.updatePrizeItemById(index, { ...prize, usage: prize.usage + 1 })
    const saveHistory = {
      id: uuidv4(),
      public_id: empId,
      name: name,
      prize_id: prize.id,
      created_at: Date.now(),
    }
    await api.addHistoryItem(saveHistory)
    await fetchPrizes()
    return prize
  } catch (error) {
    console.error(error)
    const message = 'เกิดข้อผิดพลาดบางประการ กรุณาลองใหม่อีกครั้ง'
    infoDialogRef.value?.open({
      title: 'แจ้งเตือน',
      message,
    })
  }
}

function handleOnStartSpin() {
  if (isPlaying.value || isEmptyPrize.value) return
  const prize = getPrize('test-001', 'test user')
  if (!prize) return
  prizeDrop.value = prize
  spinner.value?.spin(prize.id)
}

async function addLog(user: IUserInfo, prizeId: string) {
  try {
    const dataAddLog = {
      empId: user,
      gameId: 1,
      prizeId,
    }
    await api.addGameLogger(dataAddLog)
    // await api.addGameLogger(user.id, 1, prizeId)
  } catch (error) {
    console.error(error)
  }
}

async function handleOnProcessText(text: string) {
  console.log('text:', text)
  if (!/^https:\/\/im\.jts/.test(text)) return
  if (isProcessing.value) return
  if (isEmptyPrize.value) {
    infoDialogRef.value?.open({ title: 'แจ้งเตือน', message: 'ของรางวัลหมดแล้ว รอพบกันใหม่ในรอบหน้านะ' })
    return
  }
  isProcessing.value = true
  isPrizeShow.value = false
  isInfoShow.value = false
  try {
    const result = await api.verifyUser(text, 1)
    if (result.success) {
      // const user = result.user!
      // const prize = getPrize(String(user.id), user.first_name + ' ' + user.last_name)
      const prize = await getPrize(text, '-')
      if (!prize) return
      // await addLog(text, prize.id)
      prizeDrop.value = prize
      spinner.value?.spin(prize.id)
    } else {
      isProcessing.value = false
      const message =
        result.errorMsg === 'คุณใช้สิทธิ์เล่นเกมไปแล้ว'
          ? 'คุณเล่นกิจกรรมไปแล้ว แล้วพบกันใหม่กิจกรรมหน้า!'
          : 'ไม่พบข้อมูลการลงทะเบียน'

      infoDialogRef.value?.open({
        title: 'แจ้งเตือน',
        message,
      })
    }
  } catch (error) {
    console.log(error)
    isProcessing.value = false
    infoDialogRef.value?.open({ title: 'แจ้งเตือน', message: 'เกิดข้อผิดพลาดบางประการ กรุณาลองใหม่อีกครั้ง' })
  }
}

function listenerBarcodeScanner(event: KeyboardEvent) {
  isReceivingText.value = true
  if (event.code === 'F12') event.preventDefault()
  if (interval) clearInterval(interval)
  if (event.code === 'Enter') {
    handleOnProcessText(barcode.value)
    barcode.value = ''
  }
  if (event.key !== 'Shift' && event.key !== 'Clear') {
    barcode.value += event.key
    console.log(barcode.value)
  }
  interval = setInterval(() => {
    barcode.value = ''
    isReceivingText.value = false
  }, 100)
}

function handleOnSpinEnd() {
  setTimeout(() => {
    isProcessing.value = false
  }, 2000)
  isPrizeShow.value = true
}

function handleOnReceiveControl(e: MessageEvent) {
  const data = e.data as IGameStage
  if (data.reload) {
    // window.location.reload()
    spinner.value?.render()
  }
}

async function fetchPrizes() {
  try {
    isLoading.value = true
    const DbRealtime = await api.getPrizeFirebase()
    if (DbRealtime && DbRealtime.items && DbRealtime.items.length > 0) {
      nextTick(() => {
        items.value = DbRealtime.items
        isEmptyPrize.value = (DbRealtime.items || []).filter((item) => item.usage < item.qty).length < 1
        firstPrizeId.value = ((DbRealtime.items || []).find((item) => item.is_first) || {}).id
        spinner.value?.render()
      })
    } else {
      console.log('No items found or DbRealtime is null/undefined')
    }
  } catch (error) {
    console.error('Error fetching prizes:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  window.addEventListener('keydown', listenerBarcodeScanner)
  channel.addEventListener('message', handleOnReceiveControl)
  fetchPrizes()
})

onBeforeUnmount(() => {
  channel.removeEventListener('message', handleOnReceiveControl)
})

useHead({
  title: 'Wheel Lucky',
})
</script>

<style lang="scss" scoped>
.main-background {
  min-width: 900px !important;
  width: 900px !important;
  height: 1600px !important;
  background-color: #fef7d9;
  background-image: url('~/assets/images/bg-spin-1-6.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
}
</style>
