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
          <!-- <q-badge label="Administrator" class="q-pa-xs tw-text-xs" color="white" text-color="primary" /> -->
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
          expand-separator
          icon="groups"
          label="Manage Visitors"
        >
          <q-item 
            exact
            clickable
          >
            <q-item-section class="tw-ml-5" avatar>
              <q-icon name="house" />
            </q-item-section>
            <q-item-section>New Visitor</q-item-section>
          </q-item>
          <q-item 
            exact
            clickable
          >
            <q-item-section class="tw-ml-5" avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>List Visitors</q-item-section>
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

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
