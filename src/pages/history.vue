<template>
  <v-container fluid>
    <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>ประวัติการออกรางวัล</v-toolbar-title>
    </v-toolbar>
    <v-card color="grey-lighten-2" variant="outlined" flat>
      <v-data-table
        :headers="headers"
        :items="items"
        item-value="value"
        select-strategy="single"
        hide-default-footer
        fixed-header
      >
        <template #[`item.id`]="{ item }">
          <div class="hide-text">{{ item.id }}</div>
        </template>
        <template #[`item.prize`]="{ item }">
          {{ getPrize(item.prize_id) }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ getDateFormat(item.created_at) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useHistoryStore } from '~/stores/history.store'
import { usePrizeStore } from '~/stores/prize.store'
import type { THeaders } from '~/types/vuetify'

const historyStore = useHistoryStore()
const prizeStore = usePrizeStore()
const headers = ref<THeaders>([
  {
    title: '#',
    align: 'left',
    key: 'id',
    sortable: false,
    width: 140,
  },
  {
    title: 'ไอดี',
    align: 'left',
    key: 'public_id',
    sortable: false,
    width: 120,
  },
  {
    title: 'ชื่อที่แสดง',
    align: 'left',
    key: 'name',
    sortable: false,
    width: 120,
  },
  {
    title: 'รางวัล',
    align: 'left',
    key: 'prize',
    sortable: false,
    width: 120,
  },
  {
    title: 'วันที่ออกรางวัล',
    align: 'left',
    key: 'created_at',
    sortable: true,
    width: 120,
  },
])
const items = computed(() => historyStore.history?.items || [])
const prizeItems = computed(() => prizeStore.prize?.items || [])

function getPrize(id: string): string {
  const item = prizeItems.value.find((item) => item.id === id)
  if (!item) return ''
  return item.label
}

function getDateFormat(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

definePageMeta({
  layout: 'management',
})

useHead({
  title: 'ประวัติ',
})
</script>

<style lang="scss" scoped>
.hide-text {
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
