<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-dialog v-model="isOpen" :width="options.width ?? 480" persistent>
    <v-card>
      <v-card-title v-if="!!options.title">{{ options.title }}</v-card-title>
      <v-card-text v-if="!!options.html" v-html="options.html" />
      <v-card-text v-else>{{ options.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleOnCancel">{{ options.cancelLabel ? options.cancelLabel : 'ยกเลิก' }}</v-btn>
        <v-btn :color="options.type || 'success'" @click="handleOnConfirm">
          {{ options.confirmLabel ? options.confirmLabel : 'ยืนยัน' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IConfirmDialogOption } from '~/types/shared'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object as PropType<IConfirmDialogOption>,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const mResolve = ref<(isConfirm: boolean) => void>()
const mReject = ref<(error: Error) => void>()

const mOption = ref<IConfirmDialogOption>({})

const options = computed(() => (Object.keys(props.options).length > 0 ? props.options : mOption.value))

function open(options: IConfirmDialogOption) {
  mOption.value = options
  isOpen.value = true
  return new Promise((resolve, reject) => {
    mResolve.value = resolve
    mReject.value = reject
  })
}

function handleOnConfirm() {
  if (mResolve.value) mResolve.value(true)
  isOpen.value = false
}

function handleOnCancel() {
  if (mResolve.value) mResolve.value(false)
  isOpen.value = false
}

defineExpose({ open })
</script>
