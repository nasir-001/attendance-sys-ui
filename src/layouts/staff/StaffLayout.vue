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
          Attendance <q-badge label="Security" class="q-pa-xs" color="white" text-color="primary" />
        </q-toolbar-title>
        <div>
          <q-btn
            flat
            @click="logout()"
            dense
            class="tw-text-xs sm:tw-text-sm"
          >
            <q-icon name="logout" /> 
            Logout
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <div class="tw-mt-4 tw-text-base tw-text-gray-600 tw-text-center tw-uppercase tw-font-sans">
        <q-icon class="tw--mt-2 tw-mx-1" name="fa fa-landmark" />
          Attendance System
        <q-icon class="tw--mt-1 tw-mx-1" name="fa fa-landmark" />
      </div>
      <q-list class="q-pt-md">
        <q-expansion-item
          class="tw-text-xs sm:tw-text-sm tw-text-gray-600"
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
            :to="child.to"
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
          @click="logout()"
        >
          <q-item-section class="tw-text-gray-600" avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section class="tw-text-xs sm:tw-text-sm tw-text-gray-600">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <suspense>
        <router-view />
      </suspense>      
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const linksData = [
  {
    title: 'Manage Visitors',
    icon: 'emoji_transportation',
    showOpenExpansionStr: 'admin/visit/',
    children: [
      {
        title: 'Visitors List',
        icon: 'people',
        to: { name: 'visitors-list' }
      }
    ]
  },
];

export default defineComponent({
  name: 'StaffLayout',

  setup () {
    const leftDrawerOpen = ref(false);
    const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value;
    const $q = useQuasar();
    const $router = useRouter();

    function logout() {
      $q.localStorage.remove('authToken')
      $router.push({ name: 'login' })
    }

    return {
      links: linksData,
      leftDrawerOpen,
      toggleLeftDrawer,
      logout   
    }
  }
})
</script>