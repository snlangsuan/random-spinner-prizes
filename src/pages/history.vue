<template>
  <v-container fluid>
    <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>ประวัติการออกรางวัล</v-toolbar-title>
      <v-spacer />
      <div class="d-flex align-center" style="gap: 8px">
        <v-btn variant="flat" rounded @click="handleOnReset">
          <template #prepend>
            <v-icon>mdi-refresh</v-icon>
          </template>
          รีเซ็ตประวัติ
        </v-btn>
      </div>
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
    <custom-dialog ref="customDialogRef" v-model="isDialogShow" />
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useHistoryStore } from '~/stores/history.store'
import { usePrizeStore } from '~/stores/prize.store'
import { useUserStore } from '~/stores/user.store'
import type { THeaders } from '~/types/vuetify'
import type CustomDialog from '~/components/CustomDialog.vue'

const historyStore = useHistoryStore()
const prizeStore = usePrizeStore()
const userStore = useUserStore()
const customDialogRef = ref<InstanceType<typeof CustomDialog>>()
const isDialogShow = ref<boolean>(false)
const api = useApi()
const isLoading = ref<boolean>(false)
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
// const items = computed(() => historyStore.history?.items || [])
// const prizeItems = computed(() => prizeStore.prize?.items || [])
const items = ref([])
const prizeItems = ref([])
onMounted(() => {
  userStore.checkAuthState()
  fetchHistory()
})
async function fetchHistory() {
  try {
    isLoading.value = true
    const DbRealtime = await api.getPrizeFirebase()
    if (DbRealtime.items && DbRealtime.items.length > 0) {
      console.log({ DbRealtime })
      items.value = DbRealtime.history
    }
    if (DbRealtime.history && DbRealtime.history.length > 0) {
      console.log({ DbRealtime })
      prizeItems.value = DbRealtime.items
    }
    isLoading.value = false
  } catch (error) {
    console.error(error)
    prizeItems.value = []
  } finally {
    isLoading.value = false
  }
}

function getPrize(id: string): string {
  const item = prizeItems.value.find((item) => item.id === id)
  if (!item) return ''
  return item.label
}

function getDateFormat(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

async function handleOnReset() {
  const confirm = await customDialogRef.value?.open({
    html: `คุณต้องการล้างประวัติการออกรางวัลใช่หรือไม่`,
    confirmLabel: 'ล้างประวัติ',
    type: 'error',
    showCancelButton: true,
    showConfirmButton: true,
  })
  if (!confirm) return
  await api.clearPrizeHistory()
  await fetchHistory()

  // historyStore.reset()
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
