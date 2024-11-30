<template>
  <v-menu v-model="isOpenPicker" :close-on-content-click="false" location="center">
    <template #activator="{ props: menuProps }">
      <v-text-field :error-messages="errorMessages" v-bind="menuProps" readonly>
        <template #prepend-inner>
          <div class="text-field-color" :style="{ backgroundColor: modelValue }" />
        </template>
        {{ textColor }}
      </v-text-field>
    </template>
    <v-card>
      <v-color-picker v-model="tempColor" elevation="0" mode="hex" />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="isOpenPicker = false">ยกเลิก</v-btn>
        <v-btn @click="handleOnSelectColor">ตกลง</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  errorMessages: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const tempColor = ref<string>('')
const isOpenPicker = ref<boolean>(false)

const textColor = computed(() => String(props.modelValue).toUpperCase())

function handleOnSelectColor() {
  emit('update:modelValue', tempColor.value)
  isOpenPicker.value = false
}

watch(
  () => isOpenPicker.value,
  (val) => {
    if (val) tempColor.value = props.modelValue
  }
)
</script>

<style lang="scss" scoped>
.text-field-color {
  width: 40px;
  height: 40px;
  margin-left: -12px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  border-right: 1px solid #eee;
}
</style>
