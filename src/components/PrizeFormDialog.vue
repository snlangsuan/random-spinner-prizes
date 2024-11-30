<template>
  <v-dialog v-model="isOpen" max-width="480" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ editMode ? 'แก้ไขรางวัล' : 'เพิ่มรางวัล' }}
        <v-spacer />
        <v-icon size="24" @click="handleOnCancel">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="pb-0">
        <form @submit.prevent="">
          <div class="custom-form-item">
            <label class="custom-form-item__label custom-form-item__label--require">ไอดี</label>
            <v-text-field v-model="idField" :error-messages="idErrorMessage" :disabled="editMode" />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label custom-form-item__label--require">รางวัล</label>
            <v-text-field v-model="labelField" :error-messages="labelErrorMessage" counter />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label custom-form-item__label--require">จำนวน</label>
            <v-number-input v-model="qtyField" :error-messages="qtyErrorMessage" :min="0" />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label custom-form-item__label--require">เรทออกรางวัล</label>
            <v-number-input
              v-model="weightField"
              :error-messages="weightErrorMessage"
              :min="0"
              :max="maxWeightVal"
              :step="0.02"
            />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label custom-form-item__label--require">ภาพของรางวัล</label>
            <upload-image v-model="imageField" :error-messages="imageErrorMessage" />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label">สีพื้นหลัง</label>
            <picker-color-field v-model="bgColorField" :error-messages="bgColorErrorMessage" />
          </div>
          <div class="custom-form-item">
            <label class="custom-form-item__label">สีตัวอักษร</label>
            <picker-color-field v-model="colorField" :error-messages="colorErrorMessage" />
          </div>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="editMode" :disabled="data.usage === 0" color="error" @click="handleOnRest">
          รีเซ็ตยอดคงเหลือ
        </v-btn>
        <v-spacer />
        <v-btn @click="handleOnCancel">ยกเลิก</v-btn>
        <v-btn @click="handleOnSubmit">ตกลง</v-btn>
      </v-card-actions>
    </v-card>

    <confirm-dialog ref="confirmDialogRef" v-model="isConfirmReset" />
  </v-dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { prizeItemValidatorSchema } from '~/validators/prize.validator'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import type { PrizeData } from '~/types/prize'
import type zod from 'zod'
import type { PropType } from 'vue'

type PrizeItem = zod.infer<typeof prizeItemValidatorSchema>

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<PrizeData>,
    default: () => ({}),
  },
  editMode: {
    type: Boolean,
    default: false,
  },
  maxWeight: {
    type: Number,
    default: 0,
  },
  ids: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:data', 'save', 'reset'])

const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()
const isConfirmReset = ref<boolean>(false)

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(open: boolean) {
    emit('update:modelValue', open)
  },
})

const maxWeightVal = computed(() => Math.max(props.data.weight, props.maxWeight))

const { handleSubmit, handleReset, setFieldValue, setFieldError } = useForm({
  validationSchema: toTypedSchema(prizeItemValidatorSchema),
  initialValues: {
    label: '',
    id: '',
    image: '',
    qty: 0,
    weight: 0,
    color: '#000000',
    bg_color: '#ffffff',
  },
})

const { value: labelField, errorMessage: labelErrorMessage } = useField<string>('label')
const { value: idField, errorMessage: idErrorMessage } = useField<string>('id')
const { value: qtyField, errorMessage: qtyErrorMessage } = useField<number>('qty')
const { value: bgColorField, errorMessage: bgColorErrorMessage } = useField<string>('bg_color')
const { value: colorField, errorMessage: colorErrorMessage } = useField<string>('color')
const { value: imageField, errorMessage: imageErrorMessage } = useField<string>('image')
const { value: weightField, errorMessage: weightErrorMessage } = useField<number>('weight')

function handleOnSubmit() {
  handleSubmit((values: PrizeItem) => {
    if (!props.editMode && props.ids.includes(values.id)) {
      setFieldError('id', 'ไอดีนี้มีอยู่แล้ว')
      return
    }
    console.log(values)
    emit('update:data', values)
    emit('save', values)
    emit('update:modelValue', false)
  })()
}

function handleOnCancel() {
  emit('update:modelValue', false)
}

async function handleOnRest() {
  const confirmed = await confirmDialogRef.value?.open({
    message: 'คุณต้องการรีเซ็ตยอดคงเหลือใช่หรือไม่',
    confirmLabel: 'ยืนยัน',
    type: 'error',
    width: 320,
  })
  if (!confirmed) return
  emit('reset', props.data.id)
}

watch(
  () => isOpen.value,
  (val) => {
    if (val) {
      handleReset()
      if (props.editMode) {
        setFieldValue('label', props.data.label || undefined)
        setFieldValue('id', props.data.id || undefined)
        setFieldValue('qty', props.data.qty ?? 0)
        setFieldValue('image', props.data.image || '')
        setFieldValue('weight', props.data.weight || 0)
        setFieldValue('color', props.data.color || '#888888')
        setFieldValue('bg_color', props.data.bg_color || '#ffffff')
      }
    }
  }
)
</script>
