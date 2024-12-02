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
      @remove="handleOnRemovePrize"
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
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import { GAME_MESSAGE_CHANNEL } from '~/constants/game'
import ExcelJs from 'exceljs'
import type CustomDialog from '~/components/CustomDialog.vue'
import type { PrizeData } from '~/types/prize.d'

const prizeStore = usePrizeStore()

const customDialogRef = ref<InstanceType<typeof CustomDialog>>()
const isDialogShow = ref<boolean>(false)
const maxItems = ref<number>(20)
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

const prizeItems = computed(() => prizeStore.prize?.items || [])
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

function handleOnSavePrize() {
  if (isEditMode.value) {
    const oldItem = prizeItems.value.find((item) => item.id === editPrizeItem.value.id) ?? {}
    const item = Object.assign(oldItem, editPrizeItem.value)
    prizeStore.updatePrize(editPrizeItem.value.id, item)
  } else {
    prizeStore.addPrize(editPrizeItem.value)
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
    return new Promise<void>((resolve) => {
      input.addEventListener('change', () => {
        // console.log(input.files)
        // resolve()
        if (!input.files || input.files.length < 1) return resolve()
        const file = input.files[0]
        
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

function readFileToBuffer(file: File) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

async function readImportFile(file: File) {
  const workbook = new ExcelJs.Workbook()
  const buffer = await readFileToBuffer(file)
  const data = await workbook.csv.load(buffer)
}

async function handleOnExportPrizes() {
  try {
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet()
    sheet.addRow(['is_first', 'id', 'label', 'image', 'weight', 'usaage', 'qty', 'color', 'bg_color'])
    for (const item of prizeStore.prize?.items || []) {
      sheet.addRow([
        item.is_first,
        item.id,
        item.label,
        item.image,
        item.weight,
        item.usage,
        item.qty,
        String(item.color).toLowerCase(),
        String(item.bg_color).toLowerCase(),
      ])
    }
    const filename = `prize-items-${Date.now()}.csv`
    const buffer = await workbook.csv.writeBuffer()
    const blob = new Blob([buffer])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (_error) {
    customDialogRef.value?.open({
      message: 'ไม่สามารถนำข้อมูลออกได้',
      showCancelButton: true,
      cancelLabel: 'ตกลง',
    })
  }
}

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
