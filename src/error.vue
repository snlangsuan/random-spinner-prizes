<template>
  <v-app>
    <v-main>
      <div class="error-container">
        <div class="error-container__box">
          <h1 class="error-container__header">{{ error?.statusCode }} <span>That's an error</span></h1>
          <div class="error-container__message">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const props = defineProps({
  error: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    type: Object as PropType<Record<string, any>>,
    default: undefined,
  },
})
const messages = {
  404: 'The requested URL {} was not found on this server.',
  500: 'Please wait a few minutes before you try again.',
  403: 'You client does not have permission to get URL {} from this server.',
}
const route = useRoute()
const currentPath = computed(() => route.path)
const errorMessage = computed(() =>
  messages[props.error?.statusCode as keyof typeof messages].replace('{}', currentPath.value)
)
</script>

<style lang="scss" scoped>
.error-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &__header {
    font-weight: 200;

    & > span {
      font-size: 1rem !important;
    }
  }
  &__box {
    color: rgb(66, 66, 66);
  }
}
</style>
