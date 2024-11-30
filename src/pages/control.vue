<template>
  <v-container fluid>
    <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>
        ของรางวัล
        <span class="font-weight-regular">({{ prizeItems.length }}/{{ maxItems }})</span>
      </v-toolbar-title>
      <v-spacer />
      <div class="d-flex" style="gap: 8px">
        <v-btn variant="flat" rounded @click="handleOnReset">
          <template #prepend>
            <v-icon>mdi-refresh</v-icon>
          </template>
          รีเซ็ต
        </v-btn>
        <v-btn color="primary" variant="flat" rounded @click="handleOnCreatePrize">
          <template #prepend>
            <v-icon>mdi-plus</v-icon>
          </template>
          เพิ่มรางวัล
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

    <confirm-dialog ref="confirmDialogRef" v-model="isConfirmDelete" />
  </v-container>
</template>

<script lang="ts" setup>
import { usePrizeStore } from '~/stores/prize.store'
import type ConfirmDialog from '~/components/ConfirmDialog.vue'
import type { PrizeData } from '~/types/prize.d'

const prizeStore = usePrizeStore()

const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()
const isConfirmDelete = ref<boolean>(false)
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
  const confirm = await confirmDialogRef.value?.open({
    html: `คุณต้องการลบ <strong>${prize.label} (${prize.id})</strong> ออกจากรายการของรางวัลหรือไม่`,
    confirmLabel: 'ลบ',
    type: 'error',
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
  const result = await confirmDialogRef.value?.open({
    type: 'error',
    message: 'ต้องการจะรีเซ็ตข้อมูลใช่หรือไม่',
    confirmLabel: 'รีเซ็ต',
    width: 320,
  })
  if (!result) return
  prizeStore.resetUsage()
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
