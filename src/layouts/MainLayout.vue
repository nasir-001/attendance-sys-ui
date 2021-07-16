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
      <div class="tw-mt-4 tw-text-base tw-text-gray-600 tw-text-center tw-uppercase tw-font-sans">Attendance System</div>
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
        <router-view>
        </router-view>
          <template #fallback>
            <div class="q-pa-md q-mt-lg tw-w-full xl:tw-w-5/6 tw-h-5/6 tw-mx-auto">
              <q-markup-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                    <th class="text-right">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                    <th class="text-right">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                    <th class="text-right">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                    <th class="text-right">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                    <th class="text-right">
                      <q-skeleton animation="blink" type="text" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="n in 6" :key="n">
                    <td class="text-left">
                      <q-skeleton animation="blink" type="QAvatar" />
                    </td>
                    <td class="text-right">
                      <q-skeleton animation="blink" type="text" width="50px" />
                    </td>
                    <td class="text-right">
                      <q-skeleton animation="blink" type="text" width="50px" />
                    </td>
                    <td class="text-right">
                      <q-skeleton animation="blink" type="text" width="65px" />
                    </td>
                    <td class="text-right">
                      <q-skeleton animation="blink" type="text" width="40px" />
                    </td>
                    <td class="text-right">
                      <q-skeleton animation="blink" type="text" width="85px" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </template>      
      </suspense>      
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

const linksData = [
  {
    title: 'Manage Visitors',
    icon: 'groups',
    children: [
      {
        title: 'New Visitor',
        icon: 'account_balance',
        to: { name: 'new-visitor' }
      },
      {
        title: 'Visitors List',
        icon: 'people',
        to: { name: 'visitors-list' }
      },
      {
        title: 'Search Visitor',
        icon: 'person_search',
        to: { name: 'search-visitors' }
      }
    ]
  },
];

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false);
    const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value }

    return {
      links: linksData,
      leftDrawerOpen,
      toggleLeftDrawer      
    }
  }
})
</script>