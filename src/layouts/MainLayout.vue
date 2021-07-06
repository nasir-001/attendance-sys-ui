<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="tw-text-lg sm:tw-text-xl">
          Attendance
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <div class="tw-mt-4 tw-text-lg tw-text-gray-700 tw-text-center">Attendance System</div>
      <q-list class="q-pt-md">
        <q-expansion-item
          class="tw-text-sm sm:tw-text-base tw-text-gray-600"
          v-for="link in links"
          :key="link.title"
          :icon="link.icon"
          :label="link.title"
        >
          <q-item 
            exact
            clickable
            v-for="child in link.children"
            :key="child.title"
            :inset-level="0.5"
            active-class="text-primary"
          >
            <q-item-section avatar>
              <q-icon :name="child.icon" />
            </q-item-section>
            <q-item-section>{{ child.title }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item
          v-ripple
          clickable
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section class="tw-text-sm sm:tw-text-base tw-text-gray-600">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'

const linksData = [
  {
    title: 'Manage Visitors',
    icon: 'groups',
    children: [
      {
        title: 'New Visitor',
        icon: 'house',
        to: { name: 'new-visitor' }
      },
      {
        title: 'Visitors List',
        icon: 'people_outline',
        to: { name: 'visitor' }
      }
    ]
  },
];

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false);
    
    return {
      links: linksData,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
