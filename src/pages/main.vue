<template>
  <v-container class="fill-height">
    <v-row class="fill-height align-center justify-center">
      <div class="text-center">
        <wheel-spinner ref="spinner" :data="data" @end="handleOnSpinEnd" />
        <!-- <v-btn @click="handleOnStartSpin">Spin</v-btn> -->
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type WheelSpinner from '~/components/WheelSpinner.vue'
import type { PrizeData } from '~/types/wheel.spinner'

const api = useApi()
const spinner = ref<InstanceType<typeof WheelSpinner>>()
const data = ref<Array<PrizeData>>([
  {
    label: 'สติ๊กเกอร์',
    value: 1,
    bg_color: '#ffffff',
    qty: 200,
  },
  {
    label: '002',
    value: 2,
    bg_color: '#FFEBEE',
    qty: 10,
  },
  {
    label: '003',
    value: 3,
    bg_color: '#E8EAF6',
    qty: 10,
  },
  {
    label: 'สติ๊กเกอร์',
    value: 5,
    bg_color: '#ffffff',
    qty: 200,
  },
  {
    label: '004',
    value: 4,
    bg_color: '#E3F2FD',
    qty: 10,
  },
  {
    label: '006',
    value: 6,
    bg_color: '#F9FBE7',
    qty: 10,
  },
])

let interval: ReturnType<typeof setInterval> | undefined = undefined
let barcode: string = ''
const isProcessing = ref<boolean>(false)
function handleOnStartSpin() {
  spinner.value?.spin(1)
}

function randomPrize() {
  const items = data.value.filter((item) => item.qty > 0)
  return items[Math.floor(Math.random() * items.length)]
}

async function handleOnProcessText(text: string) {
  console.log('text', text, isProcessing.value)
  if (isProcessing.value) return
  isProcessing.value = true
  try {
    const result = await api.verifyUser(text, 1)
    console.log(result)
    if (result.success) {
      const prize = randomPrize()
      console.log('prize', prize)
      spinner.value?.spin(prize.value)
    } else {
      isProcessing.value = false
    }
  } catch (error) {
    console.log(error)
    isProcessing.value = false
  }
}

function listenerBarcodeScanner(event: KeyboardEvent) {
  if (event.code === 'F12') event.preventDefault()
  if (interval) clearInterval(interval)
  if (event.code === 'Enter') handleOnProcessText(barcode)
  if (event.key !== 'Shift') barcode += event.key
  interval = setInterval(() => (barcode = ''), 20)
}

function handleOnSpinEnd() {
  console.log('end')
  isProcessing.value = false
}

onMounted(() => {
  window.addEventListener('keydown', listenerBarcodeScanner)
})
</script>
