<template>
  <v-container fluid>
    <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>
        ของรางวัล
        <span class="font-weight-regular">({{ prizeItems.length }}/{{ maxItems }})</span>
      </v-toolbar-title>
      <v-spacer />
      <div class="d-flex align-center" style="gap: 8px">
        <v-btn variant="flat" rounded @click="handleOnReset">
          <template #prepend>
            <v-icon>mdi-gift-outline</v-icon>
          </template>
          รีเซ็ตรา่งวัล
        </v-btn>
        <v-btn color="primary" variant="flat" rounded @click="handleOnCreatePrize">
          <template #prepend>
            <v-icon>mdi-plus</v-icon>
          </template>
          เพิ่มรางวัล
        </v-btn>
        <v-btn density="compact" icon>
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item title="รีโหลดจอ" @click="handleOnReloadScreen">
                <template #prepend>
                  <v-icon>mdi-monitor</v-icon>
                </template>
              </v-list-item>
              <v-list-item title="นำเข้าของรางวัล" @click="handleOnImportPrizes">
                <template #prepend>
                  <v-icon>mdi-file-upload-outline</v-icon>
                </template>
              </v-list-item>
              <v-list-item title="นำออกของรางวัล" @click="handleOnExportPrizes">
                <template #prepend>
                  <v-icon>mdi-file-download-outline</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </v-toolbar>
    <prize-table
      :data="prizeItems"
      @edit="handleOnEditPrize"
      @remove="handleOnRemovePrizeOnFirebase"
      @up="handleOnMoveUp"
      @down="handleOnMoveDown"
    />

    <prize-form-dialog
      v-model="isEditFormOpen"
      v-model:data="editPrizeItem"
      :edit-mode="isEditMode"
      :max-weight="maxWeight"
      :ids="prizeIds"
      @save="handleOnSavePrize"
      @reset="handleOnResetPrizeBalance"
    />

    <custom-dialog ref="customDialogRef" v-model="isDialogShow" />
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate />
    </v-overlay>
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import { GAME_MESSAGE_CHANNEL } from '~/constants/game'
import * as d3 from 'd3'
import type CustomDialog from '~/components/CustomDialog.vue'
import type { PrizeData } from '~/types/prize.d'
import { useUserStore } from '~/stores/user.store'
const api = useApi()
const userStore = useUserStore()
// api

async function fetchPrizes() {
  try {
    const DbRealtime = await api.getPrizeFirebase()
    console.log({ DbRealtime })
    if (DbRealtime.items && DbRealtime.items.length > 0) {
      prizeItems.value = DbRealtime.items
    }
  } catch (error) {
    console.error('Error fetching prizes:', error)
  }
}

onMounted(() => {
  fetchPrizes()
  userStore.checkAuthState()
})

const prizeStore = usePrizeStore()

const customDialogRef = ref<InstanceType<typeof CustomDialog>>()
const isDialogShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const maxItems = ref<number>(12)
const editPrizeItem = ref<PrizeData>({
  id: '',
  label: '',
  qty: 0,
  usage: 0,
  image: '',
  weight: 0.0,
})
const isEditFormOpen = ref<boolean>(false)
const isEditMode = ref<boolean>(false)
const prizeFirebase = ref<PrizeData | null>(null)
// const prizeItems = computed(() => prizeStore.prize?.items || [])
const prizeItems = ref([])
const totalWeight = computed(() => prizeItems.value.reduce((total, item) => total + item.weight, 0))
const maxWeight = computed(() => 1 - totalWeight.value)
const prizeIds = computed(() => prizeItems.value.map((item) => item.id))
const channel = new BroadcastChannel(GAME_MESSAGE_CHANNEL)

function handleOnCreatePrize() {
  editPrizeItem.value = {
    id: '',
    label: '',
    qty: 0,
    usage: 0,
    image: '',
    weight: 0.0,
    bg_color: '#ffffff',
    color: '#000000',
  }
  isEditMode.value = false
  isEditFormOpen.value = true
}

async function handleOnSavePrize() {
  if (isEditMode.value) {
    const oldItem = prizeItems.value.find((item) => item.id === editPrizeItem.value.id) ?? {}
    const item = Object.assign(oldItem, editPrizeItem.value)
    console.log({ itemEdit: item })
    const index = prizeItems.value.findIndex((item) => item.id === editPrizeItem.value.id)
    await api.updatePrizeItemById(index, item)
    await fetchPrizes()
    // prizeStore.updatePrize(editPrizeItem.value.id, item)
  } else {
    // prizeStore.addPrize(editPrizeItem.value)
    await api.addPrizeItemWithIndex(editPrizeItem.value)
    await fetchPrizes()
  }
  isEditMode.value = false
  isEditFormOpen.value = false
}

function handleOnEditPrize(id: string) {
  const prize = prizeItems.value.find((item) => item.id === id)
  if (!prize) return
  isEditMode.value = true
  editPrizeItem.value = prize
  isEditFormOpen.value = true
}

async function handleOnRemovePrizeOnFirebase(id: string) {
  await api.removePrizeItemByKey(id)
  const confirm = await customDialogRef.value?.open({
    html: `คุณต้องการลบ <strong>${'prize.label'} (${'prize.id'})</strong> ออกจากรายการของรางวัลหรือไม่`,
    confirmLabel: 'ลบ',
    type: 'error',
    showCancelButton: true,
    showConfirmButton: true,
  })
  if (confirm) {
    await api.removePrizeItemByKey(id)
    await fetchPrizes()
  }
}
async function handleOnRemovePrize(id: string) {
  const prize = prizeItems.value.find((item) => item.id === id)
  if (!prize) return
  const confirm = await customDialogRef.value?.open({
    html: `คุณต้องการลบ <strong>${prize.label} (${prize.id})</strong> ออกจากรายการของรางวัลหรือไม่`,
    confirmLabel: 'ลบ',
    type: 'error',
    showCancelButton: true,
    showConfirmButton: true,
  })
  if (confirm) prizeStore.removePrize(id)
}

function handleOnMoveUp(id: string) {
  prizeStore.moveUp(id)
}

function handleOnMoveDown(id: string) {
  prizeStore.moveDown(id)
}

function handleOnResetPrizeBalance(id: string) {
  const prize = prizeItems.value.find((item) => item.id === id)
  if (!prize) return
  prize.usage = 0
  prizeStore.updatePrize(prize.id, prize)
}

async function handleOnReset() {
  const result = await customDialogRef.value?.open({
    type: 'error',
    message: 'ต้องการจะรีเซ็ตข้อมูลใช่หรือไม่',
    confirmLabel: 'รีเซ็ต',
    width: 320,
    showCancelButton: true,
    showConfirmButton: true,
  })
  if (!result) return
  prizeStore.resetUsage()
}

function handleOnReloadScreen() {
  channel.postMessage({ reload: true })
}

async function handleOnImportPrizes() {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'text/csv'
    return new Promise<void>((resolve, reject) => {
      input.addEventListener('change', async () => {
        if (!input.files || input.files.length < 1) return resolve()
        const file = input.files[0]
        try {
          const data = await csvToJson(file)
          prizeStore.load(data)
        } catch (error) {
          reject(error)
        }
      })
      input.dispatchEvent(new MouseEvent('click'))
    })
  } catch (_error) {
    customDialogRef.value?.open({
      message: 'ไม่สามารถนำข้อมูลออกได้',
      showCancelButton: true,
      cancelLabel: 'ตกลง',
    })
  }
  // customDialogRef.value?.open({
  //   message: 'ไม่สามารถนำข้อมูลออกได้',
  //   showCancelButton: true,
  //   cancelLabel: 'ตกลง'
  // })
}

async function csvToJson(file: File): Promise<Array<PrizeData> | []> {
  const text = await readFileToBuffer(file)
  const jsonData = await d3.csvParse(text, (row) => {
    return { ...row, weight: Number(row.weight), usage: Number(row.usage), qty: Number(row.qty) }
  })
  return jsonData as unknown as Array<PrizeData>
}

function readFileToBuffer(file: File): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

async function handleOnExportPrizes() {
  try {
    isLoading.value = true
    const items = prizeStore.prize?.items || []
    const csv = jsonToCsv(items)
    writeFile(csv)
    isLoading.value = false
  } catch (_error) {
    isLoading.value = false
    customDialogRef.value?.open({
      message: 'ไม่สามารถนำข้อมูลออกได้',
      showCancelButton: true,
      cancelLabel: 'ตกลง',
    })
  }
}

function jsonToCsv(items: Array<PrizeData>) {
  const header = Object.keys(items[0])
  const headerString = header.join(',')
  const replacer = (key: string, value: unknown) => value ?? ''
  const rowItems = items.map((row) =>
    header.map((fieldName) => JSON.stringify(row[fieldName as keyof typeof row], replacer)).join(',')
  )
  const csv = [headerString, ...rowItems].join('\r\n')
  return csv
}

function writeFile(content: string) {
  const file = new Blob([content], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(file)
  link.download = `prize-items-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

definePageMeta({
  layout: 'management',
})

useHead({
  title: 'จัดการของรางวัล',
})
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
