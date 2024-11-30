<template>
  <v-container class="fill-height" style="background-color: #fff8e1" fluid>
    <v-row class="fill-height align-center justify-center">
      <div class="text-center">
        <wheel-spinner ref="spinner" v-model:playing="isPlaying" :data="items" @end="handleOnSpinEnd" />
      </div>
    </v-row>
    <div style="position: fixed; bottom: 16px; right: 16px">
      <v-btn :disabled="isPlaying" @click="handleOnStartSpin">Spin</v-btn>
    </div>
    <prize-scene v-model="isPrizeShow" :prize="prizeDrop" />
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import type WheelSpinner from '~/components/WheelSpinner.vue'
import type { PrizeData } from '~/types/prize.d'

const prizeStore = usePrizeStore()
const api = useApi()
const spinner = ref<InstanceType<typeof WheelSpinner>>()
const isPlaying = ref<boolean>(false)
const items = computed(() => prizeStore.prize?.items || [])

let interval: ReturnType<typeof setInterval> | undefined = undefined
let barcode: string = ''
const isProcessing = ref<boolean>(false)
const isPrizeShow = ref<boolean>(false)
const prizeDrop = ref<PrizeData>()
const isEmptyPrize = computed(() => (prizeStore.prize?.items || []).filter((item) => item.usage < item.qty).length < 1)

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
  if (isProcessing.value || isEmptyPrize.value) return
  isProcessing.value = true
  try {
    const result = await api.verifyUser(text, 1)
    if (result.success) {
      const prize = weightedRandom(items.value.filter((item) => item.usage < item.qty))
      if (!prize) return
      prizeStore.updatePrize(prize.id, { ...prize, usage: prize.usage + 1 })
      prizeDrop.value = prize
      spinner.value?.spin(prize.id)
    } else {
      isProcessing.value = false
    }
  } catch (error) {
    console.log(error)
    isProcessing.value = false
  }
}

function listenerBarcodeScanner(event: KeyboardEvent) {
  console.log(event.key, event.code)
  if (event.code === 'F12') event.preventDefault()
  if (interval) clearInterval(interval)
  if (event.code === 'Enter') handleOnProcessText(barcode)
  if (event.key !== 'Shift') {
    barcode += event.key
    console.log(event.key, barcode)
  }
  interval = setInterval(() => (barcode = ''), 20)
}

function handleOnSpinEnd() {
  isProcessing.value = false
  isPrizeShow.value = true
}

onMounted(() => {
  window.addEventListener('keydown', listenerBarcodeScanner)
})

useHead({
  title: 'Wheel Lucky',
})
</script>
