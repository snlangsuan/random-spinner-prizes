<template>
  <v-dialog v-model="isOpen" max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        text="Change background"
        class="text-none"
        variant="outlined"
        @click="handleOnOpen"
      />
    </template>
    <template #default>
      <v-card title="Change background">
        <v-card-text>
          <v-form>
            <div class="form-item form-item--inline">
              <div>Background color</div>
              <!-- <v-color-picker v-model="localBgColor" mode="rgb" hide-inputs /> -->
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <div class="prize-background-color-field" :style="{ backgroundColor: localBgColor }" v-bind="props" />
                </template>
                <v-card min-width="300">
                  <v-color-picker v-model="localBgColor" mode="rgb" hide-inputs />
                </v-card>
              </v-menu>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text="Cancel" class="text-none" @click="handleOnClose" />
          <v-btn text="Save" class="text-none" @click="handleOnSave" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  bgImg: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: '',
  },
})
// const emit = defineEmits(['update:modelValue'])
const isOpen = ref<boolean>(false)
const localBgImg = ref<string>('')
const localBgColor = ref<string>('')

function handleOnOpen() {
  localBgImg.value = props.bgImg
  localBgColor.value = props.bgColor
}

function handleOnClose() {
  isOpen.value = false
}
function handleOnSave() {
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
.prize-background {
  &-color-field {
    position: relative;
    width: 40px;
    height: 40px;
    border: 4px solid #ffffff;
    border-radius: 4px;

    &::after {
      content: '';
      position: absolute;
      left: -4px;
      right: -4px;
      top: -4px;
      bottom: -4px;
      border: 1px solid #888888;
      border-radius: 4px;
    }
  }
}
</style>
