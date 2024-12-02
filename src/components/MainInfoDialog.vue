<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-dialog v-model="isOpen" :width="options.width ?? 480">
    <v-card color="#fff8e0" style="border-radius: 12px">
      <v-card-title v-if="!!options.title" class="custom-dialog-title">
        {{ options.title }}
        <v-icon class="custom-dialog-title__close" @click="handleOnCancel">mdi-close</v-icon>
      </v-card-title>
      <!-- <v-card-text v-if="!!options.html" v-html="options.html" /> -->
      <v-card-text :style="{ paddingLeft: '8px', paddingRight: '8px', paddingTop: 0, paddingBottom: '8px' }">
        <div
          :style="{
            minHeight: '80px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          {{ options.message }}
        </div>
      </v-card-text>
      <!-- <v-card-actions class="d-flex align-center justify-center">
        <v-btn variant="flat" color="#FEAF7A" style="width: 140px" @click="handleOnCancel">
          {{ options.cancelLabel ? options.cancelLabel : 'ตกลง' }}
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { IConfirmDialogOption } from '~/types/shared.d'

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

function handleOnCancel() {
  if (mResolve.value) mResolve.value(false)
  isOpen.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.custom-dialog-title {
  text-align: center;
  position: relative;

  &__close {
    opacity: 0.2;
    position: absolute;
    right: 8px;
  }
}
</style>
