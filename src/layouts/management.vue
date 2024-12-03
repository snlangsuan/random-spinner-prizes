<template>
  <v-app id="management">
    <v-app-bar color="primary" name="app-bar">
      <v-app-bar-nav-icon @click="isOpenDrawer = !isOpenDrawer" />
      <v-app-bar-title>ระบบจัดการวงล้อ</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="isOpenDrawer">
      <v-list nav>
        <v-list-item title="ของรางวัล" :to="{ name: 'control' }">
          <template #prepend>
            <v-icon>mdi-shape-outline</v-icon>
          </template>
        </v-list-item>
        <v-list-item title="ประวัติการออกรางวัล" :to="{ name: 'history' }">
          <template #prepend>
            <v-icon>mdi-clipboard-text-clock-outline</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const isOpenDrawer = ref<boolean>(false)
</script>
