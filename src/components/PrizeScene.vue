<template>
  <v-overlay v-model="isOpen" class="align-center justify-center" opacity="0.8" contained persistent>
    <div class="prize-scene__container">
      <div class="prize-scene__close" @click="handleOnClose">
        <v-icon color="#ffffff">mdi-close</v-icon>
      </div>
      <div class="prize-scene__content">
        <div class="prize-scene__item">
          <!-- <div class="prize-scene__title">ยินดีด้วยคุณได้รับ</div> -->
          <v-img
            :src="prize.image"
            class="prize-scene__image"
            position="center bottom"
            height="300"
            width="300"
            contain
          />
          <div class="prize-scene-text">
            <div class="prize-scene-text__message">ยินดีด้วยคุณได้รับ</div>
            <div class="prize-scene-text__reward">{{ prize.label }}</div>
          </div>
        </div>
      </div>
      <div class="text-center" :style="{ marginTop: '-24px' }">จะปิดภายใน {{ countClose }} วินาที</div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { PrizeData } from '~/types/prize.d'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  prize: {
    type: Object as PropType<PrizeData>,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const countClose = ref<number>(5)
let interval: ReturnType<typeof setInterval> | undefined = undefined
const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

function handleOnClose() {
  isOpen.value = false
}

function handleOnClearInterval() {
  countClose.value = countClose.value - 1
  if (countClose.value <= 0) {
    clearInterval(interval)
    isOpen.value = false
  }
}

watch(isOpen, (val) => {
  if (val) {
    if (interval) clearInterval(interval)
    countClose.value = 2
    interval = setInterval(handleOnClearInterval, 1000)
  }
})
</script>

<style lang="scss" scoped>
.prize-scene {
  &__container {
    position: relative;
  }

  &__content {
    width: 600px;
    height: 520px;
    background-image: url('~/assets/images/gift-box-bottom.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      width: 100%;
      height: 160px;
      background-image: url('~/assets/images/gift-box-top.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: top center;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }

  &__item {
    position: absolute;
    bottom: 80px;
  }

  &__image {
    object-fit: contain;
    object-position: center bottom;
    margin-bottom: -42px;
    z-index: 1;
  }

  &-text {
    // background-color: rgba(255, 255, 255, 0.1);
    /* From https://css.glass */
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 16px;

    &__message {
      font-size: 1rem;
      color: #ffffff;
      text-align: center;
    }
    &__reward {
      text-align: center;
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
    }
  }

  &__title {
    font-size: 1.4rem;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    overflow: hidden;
    font-weight: 800;
    color: #ffffff;
    text-align: center;
    padding: 16px;
    position: absolute;
    top: -200px;
  }

  &__close {
    position: fixed;
    top: 4px;
    right: 4px;
    border-radius: 50%;
    padding: 4px;
    z-index: 3;
    opacity: 0.1;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
