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
    <div style="position: fixed; bottom: 16px; right: 16px">
      <v-btn :disabled="isPlaying" @click="handleOnStartSpin">Spin</v-btn>
    </div>
    <prize-scene v-model="isPrizeShow" :prize="prizeDrop" />
    <main-info-dialog ref="infoDialogRef" v-model="isInfoShow" />
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import MainInfoDialog from '~/components/MainInfoDialog.vue'
import { GAME_MESSAGE_CHANNEL } from '~/constants/game'
import type WheelSpinner from '~/components/WheelSpinner.vue'
import type { PrizeData } from '~/types/prize.d'
import type { IGameStage } from '~/types/game.d'

const prizeStore = usePrizeStore()
const api = useApi()
const spinner = ref<InstanceType<typeof WheelSpinner>>()
const infoDialogRef = ref<InstanceType<typeof MainInfoDialog>>()
const isPlaying = ref<boolean>(false)
const items = computed(() => prizeStore.prize?.items || [])
const channel = new BroadcastChannel(GAME_MESSAGE_CHANNEL)

let interval: ReturnType<typeof setInterval> | undefined = undefined
let barcode: string = ''
const isProcessing = ref<boolean>(false)
const isPrizeShow = ref<boolean>(false)
const isInfoShow = ref<boolean>(false)
const prizeDrop = ref<PrizeData>()
const isEmptyPrize = computed(() => (prizeStore.prize?.items || []).filter((item) => item.usage < item.qty).length < 1)
const firstPrizeId = computed(() => ((prizeStore.prize?.items || []).find((item) => item.is_first) || {}).id)

function handleOnStartSpin() {
  if (isPlaying.value || isEmptyPrize.value) return
  const prize = weightedRandom(items.value.filter((item) => item.usage < item.qty))
  if (!prize) return
  console.log(prize.id, prize.label)
  prizeStore.updatePrize(prize.id, { ...prize, usage: prize.usage + 1 })
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
      const prize = weightedRandom(items.value.filter((item) => item.usage < item.qty))
      if (!prize) return
      console.log(prize.id, prize.label)
      prizeStore.updatePrize(prize.id, { ...prize, usage: prize.usage + 1 })
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
  // console.log(event.key, event.code)
  if (event.code === 'F12') event.preventDefault()
  if (interval) clearInterval(interval)
  if (event.code === 'Enter') handleOnProcessText(barcode)
  if (event.key !== 'Shift') {
    barcode += event.key
    // console.log(event.key, barcode)
  }
  interval = setInterval(() => (barcode = ''), 20)
}

function handleOnSpinEnd() {
  isProcessing.value = false
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
