<template>
  <div class="upload-image__container">
    <div v-if="img" class="upload-image-preview">
      <div class="upload-image-preview__close">
        <v-icon @click="handleOnRemoveImage">mdi-close</v-icon>
      </div>
      <v-img :src="img" aspect-ratio="16/9" contain />
    </div>
    <div v-else class="upload-image-uploader">
      <div class="upload-image-uploader__content" @drop.prevent="handleOnDropFile" @dragenter.prevent @dragover.prevent>
        <div class="upload-image-uploader__actions">
          <v-icon color="primary" size="48">mdi-image-size-select-actual</v-icon>
          <div>
            วางภาพของคุณที่นี่ หรือ
            <span class="upload-image-uploader__link" @click="$refs.imageFileRef.click()">เลือกไฟล์</span>
          </div>
        </div>
        <input ref="imageFileRef" type="file" accept="image/png,image/jpeg" @change="handleOnImageChange" />
      </div>
    </div>
    <v-input class="px-4" :error-messages="errorMessages || localError" />
  </div>
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

const imageFileRef = ref<HTMLInputElement>()

const localError = ref<string | string[]>([])
const img = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

async function readImage(file: File): Promise<string> {
  const data = await imageCompressor(file, 'image/png')
  const base64 = await convDataURL(data)
  return base64
}

async function handleOnImageChange() {
  const files = imageFileRef.value?.files
  if (!files || files.length < 1) return
  try {
    const file = files[0]
    const base64 = await readImage(file)
    img.value = base64
  } catch (_error) {
    localError.value = 'เกิดข้อผิดพลาดไม่สามารถอ่านภาพได้'
  } finally {
    imageFileRef.value!.type = 'text'
    imageFileRef.value!.type = 'file'
  }
}

async function handleOnDropFile(event: DragEvent) {
  if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length < 1) return
  const files = event.dataTransfer.files
  try {
    const file = files[0]
    const base64 = await readImage(file)
    img.value = base64
  } catch (_error) {
    localError.value = 'เกิดข้อผิดพลาดไม่สามารถอ่านภาพได้'
  }
}

function handleOnRemoveImage() {
  emit('update:modelValue', '')
}
</script>

<style lang="scss" scoped>
.upload-image {
  &__container {
    user-select: none;
  }

  &-preview,
  &-uploader > &-uploader__content {
    height: 140px;
    border-radius: 4px;
    overflow: hidden;
  }

  &-uploader {
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #dddddd;

      & > input {
        display: none;
        opacity: 0;
      }
    }

    &__btn {
      border: 2px solid #dddddd;
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__actions {
      font-size: 0.875rem;
      text-align: center;

      & > * {
        line-height: 2;
      }
    }

    &__link {
      color: #1867c0;
      font-weight: 800;
      pointer-events: all;
      cursor: pointer;
    }
  }

  &-preview {
    background-color: #eee;
    position: relative;

    &__close {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 1;
    }
  }

  &--error &-uploader {
    border-color: rgb(var(--v-theme-error));
  }
}
</style>
