<template>
  <v-container fluid>
    <v-row>
      <!-- <v-col cols="12">
        <div class="control-wheel">
          <wheel-spinner
            v-if="prizeItems.length > 0"
            :data="prizeItems"
            style="margin-top: 16px; margin-bottom: 16px"
          />
          <div v-else class="control-wheel--empty">No Item</div>
        </div>
      </v-col> -->
      <v-col cols="12">
        <div class="control-prize__toolbar">
          <v-spacer />
          <div>{{ prizeItems.length }}/{{ maxItems }}</div>
        </div>
        <prize-table :data="prizeItems" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { PrizeData } from '~/types/wheel.spinner'

const maxItems = 20
const prizeItems = ref<Array<PrizeData>>([])
</script>

<style lang="scss" scoped>
.control {
  &-wheel {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;

    &--empty {
      color: #888888;
      font-size: 0.8rem;
    }
  }

  &-prize {
    &__toolbar {
      height: 48px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      padding-right: 24px;
    }
  }
}
</style>
