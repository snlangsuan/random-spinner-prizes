<template>
  <v-container class="fill-height" style="background-color: #fff8e1" fluid>
    <v-row class="fill-height align-center justify-center">
      <div class="text-center">
        <wheel-spinner
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

const prizeStore = usePrizeStore()
const historyStore = useHistoryStore()
const api = useApi()
const spinner = ref<InstanceType<typeof WheelSpinner>>()
const infoDialogRef = ref<InstanceType<typeof MainInfoDialog>>()
const isPlaying = ref<boolean>(false)
const items = computed(() => prizeStore.prize?.items || [])
const channel = new BroadcastChannel(GAME_MESSAGE_CHANNEL)

let interval: ReturnType<typeof setInterval> | undefined = undefined
const barcode = ref<string>('')
const isReceivingText = ref<boolean>(false)
const isProcessing = ref<boolean>(false)
const isPrizeShow = ref<boolean>(false)
const isInfoShow = ref<boolean>(false)
const prizeDrop = ref<PrizeData>()
const isEmptyPrize = computed(() => (prizeStore.prize?.items || []).filter((item) => item.usage < item.qty).length < 1)
const firstPrizeId = computed(() => ((prizeStore.prize?.items || []).find((item) => item.is_first) || {}).id)

function getPrize(empId: string, name: string): PrizeData | undefined {
  const prize = weightedRandom(items.value.filter((item) => item.usage < item.qty))
  if (!prize) return
  prizeStore.updatePrize(prize.id, { ...prize, usage: prize.usage + 1 })
  historyStore.add(empId, name, prize.id)
  return prize
}

function handleOnStartSpin() {
  if (isPlaying.value || isEmptyPrize.value) return
  const prize = getPrize('test-001', 'test user')
  if (!prize) return
  prizeDrop.value = prize
  spinner.value?.spin(prize.id)
}

async function handleOnProcessText(text: string) {
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
      const user = result.user
      const prize = getPrize(user.emp_code, user.first_name + ' ' + user.last_name)
      if (!prize) return
      prizeDrop.value = prize
      spinner.value?.spin(prize.id)
    } else {
      isProcessing.value = false
      infoDialogRef.value?.open({ title: 'แจ้งเตือน', message: 'ไม่พบข้อมูลการลงทะเบียน' })
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

onMounted(() => {
  window.addEventListener('keydown', listenerBarcodeScanner)
  channel.addEventListener('message', handleOnReceiveControl)
})

onBeforeUnmount(() => {
  channel.removeEventListener('message', handleOnReceiveControl)
})

useHead({
  title: 'Wheel Lucky',
})
</script>
