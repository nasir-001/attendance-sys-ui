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
          Attendance <q-badge label="Administrator" class="q-pa-xs" color="white" text-color="primary" />
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

const linksData = [
  {
    title: 'Manage Visitors',
    icon: 'emoji_transportation',
    children: [
      {
        title: 'New Visitor',
        icon: 'person_add',
        to: { name: 'admin-new-visitor' }
      },
      {
        title: 'Visitors List',
        icon: 'people',
        to: { name: 'admin-visitors-list' }
      },
      {
        title: 'Search Visitor',
        icon: 'person_search',
        to: { name: 'admin-search-visitors' }
      }
    ]
  },
  {
    title: 'Manage Users',
    icon: 'people_outline',
    showOpenExpansionStr: 'admin/users',
    children: [
      {
        title: 'Add New User',
        icon: 'person_add',
        to: { name: 'new-user' }
      },
      {
        title: 'Users List',
        icon: 'people',
        to: { name: 'user-list' }
      }
    ]
  },
  {
    title: 'Access Control',
    icon: 'mdi-account-key-outline',
    children: [
      {
        title: 'User Permissions',
        icon: 'mdi-account-lock',
        to: { name: 'permission-list' }
      },
      {
        title: 'User Roles',
        icon: 'mdi-hat-fedora',
        to: { name: 'role-list' }
      },
      {
        title: 'User Groups',
        icon: 'groups',
        to: { name: 'group-list' }
      }
    ]
  }
];

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false);
    const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value 

    function logout() {
      console.log("logout");
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