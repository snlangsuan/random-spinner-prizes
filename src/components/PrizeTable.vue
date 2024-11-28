<template>
  <v-card outline>
    <v-data-table :headers="headers" select-strategy="single" hide-default-footer>
      <template #[`body.append`]>
        <tr style="padding-top: 8px; padding-bottom: 8px">
          <td>
            <v-checkbox disabled hide-details />
          </td>
          <td>
            <v-text-field hide-details />
          </td>
          <td>
            <v-text-field hide-details />
          </td>
          <td>
            <v-text-field hide-details />
          </td>
          <td>
            <v-text-field hide-details />
          </td>
          <td class="text-end">
            <v-btn variant="plain" color="success" icon>
              <v-icon>mdi-check</v-icon>
              <v-tooltip activator="parent" top>save</v-tooltip>
            </v-btn>
            <v-btn variant="plain" color="error" icon>
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" top>cancel</v-tooltip>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import type { THeaders } from '~/types/vuetify'
import type { PrizeData } from '~/types/wheel.spinner'

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

const headers = ref<THeaders>([
  {
    title: 'First item',
    align: 'center',
    key: 'first_item',
    sortable: false,
    width: 120,
  },
  {
    title: 'Id',
    align: 'start',
    key: 'value',
    sortable: false,
  },
  {
    title: 'Name',
    align: 'start',
    key: 'label',
    sortable: false,
  },
  {
    title: 'Icon',
    align: 'start',
    key: 'icon',
    sortable: false,
  },
  {
    title: 'Background',
    align: 'start',
    key: 'background',
    width: 140,
    sortable: false,
  },
  {
    title: '',
    align: 'end',
    key: 'tool',
    width: 140,
    sortable: false,
  },
])
</script>

<style lang="scss" scoped>
.prize-table {
  width: 100%;
  // border-collapse: collapse;
}
</style>
