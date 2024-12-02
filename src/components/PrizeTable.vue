<template>
  <v-card color="grey-lighten-2" variant="outlined" flat>
    <v-data-table
      :headers="headers"
      :items="props.data"
      item-value="value"
      select-strategy="single"
      hide-default-footer
      fixed-header
    >
      <template #[`item.first_item`]="{ item }">
        <v-checkbox
          :model-value="item.is_first"
          class="mx-auto"
          width="56"
          hide-details
          @click="handleOnChangeFirstItem(item.id, !item.is_first!)"
        />
      </template>
      <template #[`item.stock`]="{ item }">
        <div>{{ Number(item.qty) - Number(item.usage || 0) }}/{{ item.qty }}</div>
      </template>
      <template #[`item.weight`]="{ item }">
        <div>{{ Number(item.weight).toFixed(2) }}</div>
      </template>
      <template #[`item.image`]="{ item }">
        <v-img :src="item.image" class="my-2" height="60" width="60" contain />
      </template>
      <template #[`item.tools`]="{ index, item }">
        <div class="d-flex align-center justify-end" :style="{ gap: '8px' }">
          <v-tooltip text="นำขึ้น" location="top">
            <template #activator="{ props: arrowUpProps }">
              <v-icon :disabled="index === 0" v-bind="arrowUpProps" @click="handleOnMoveUp(item.id)">
                mdi-arrow-up-thin
              </v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="นำลง" location="top">
            <template #activator="{ props: arrowDownProps }">
              <v-icon
                :disabled="index >= props.data.length - 1"
                v-bind="arrowDownProps"
                @click="handleOnMoveDown(item.id)"
              >
                mdi-arrow-down-thin
              </v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="แก้ไข" location="top">
            <template #activator="{ props: editProps }">
              <v-icon v-bind="editProps" @click="handleOnEdit(item.id)">mdi-pencil-outline</v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="นำออก" location="top">
            <template #activator="{ props: removeProps }">
              <v-icon v-bind="removeProps" @click="handleOnRemove(item.id)">mdi-delete-outline</v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import type { THeaders } from '~/types/vuetify'
import type { PrizeData } from '~/types/prize.d'

const prizeStore = usePrizeStore()

const props = defineProps({
  data: {
    type: Array as PropType<Array<PrizeData>>,
    required: true,
  },
  maxItems: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['edit', 'remove', 'up', 'down', 'reset'])

const headers = ref<THeaders>([
  {
    title: 'เริ่มต้น',
    align: 'center',
    key: 'first_item',
    sortable: false,
    width: 120,
  },
  {
    title: 'ไอดี',
    align: 'start',
    key: 'id',
    sortable: false,
  },
  {
    title: 'ป้าย',
    align: 'start',
    key: 'label',
    sortable: false,
  },
  {
    title: 'ภาพของรางวัล',
    align: 'start',
    key: 'image',
    sortable: false,
  },
  {
    title: 'เรทออกรางวัล',
    align: 'start',
    key: 'weight',
    sortable: false,
  },
  {
    title: 'ยอดคงเหลือ',
    align: 'center',
    key: 'stock',
    sortable: false,
  },
  {
    title: '',
    align: 'end',
    key: 'tools',
    width: 140,
    sortable: false,
  },
])

function handleOnChangeFirstItem(id: string, value: boolean) {
  console.log('update', value)
  prizeStore.resetFirst()
  prizeStore.addFirst(id, value)
}

function handleOnEdit(id: string) {
  emit('edit', id)
}

function handleOnRemove(id: string) {
  emit('remove', id)
}

function handleOnMoveUp(id: string) {
  emit('up', id)
}

function handleOnMoveDown(id: string) {
  emit('down', id)
}
</script>

<style lang="scss" scoped>
.prize-table {
  width: 100%;
  // border-collapse: collapse;
}
</style>
