<template>
  <div>
    <wheel-spinner ref="spinner" :data="data" />
    <v-btn @click="handleOnStartSpin">Spin</v-btn>
  </div>
</template>

<script lang="ts" setup>
import type WheelSpinner from '~/components/WheelSpinner.vue';
import type { PrizeData } from '~/types/wheel.spinner'

const spinner = ref<InstanceType<typeof WheelSpinner>>()
const data = ref<Array<PrizeData>>([
  {
    label: '001',
    value: 1,
    bgColor: '#FFEBEE',
  },
  {
    label: '002',
    value: 2,
    bgColor: '#F3E5F5',
  },
  {
    label: '003',
    value: 3,
    bgColor: '#E8EAF6',
  },
  {
    label: '004',
    value: 4,
    bgColor: '#E0F2F1',
  },
  {
    label: '005',
    value: 5,
    bgColor: '#F9FBE7',
  },
])

function handleOnStartSpin() {
  spinner.value?.spin(1)
}
</script>
