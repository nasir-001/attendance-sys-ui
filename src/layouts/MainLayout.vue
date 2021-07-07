<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-purple" elevated>
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
      <div class="tw-mt-4 tw-text-lg text-purple tw-text-center">Attendance System</div>
      <q-list class="q-pt-md">
        <q-expansion-item
          class="tw-text-sm sm:tw-text-base text-purple"
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
          <q-item-section class="text-purple" avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section class="tw-text-sm sm:tw-text-base text-purple">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>  
    <q-page-container>
      <div v-if="attendances" class="tw-mt-8 md:tw-mt-0">
          <div v-for="attendance in attendances" :key="attendance.id" class="tw-my-2 md:tw-my-10 tw-mx-4 md:tw-w-3/5 md:tw-mx-auto">
            <div class="tw-flex tw-justify-between tw-border-b-2 twtext-purple">
              <div class="tw-flex tw-justify-start">
                <q-item-section avatar>
                  <img class="tw-w-16 tw-object-cover tw-h-16 tw-rounded-full" :src="attendance.image" >
                  <div class="tw-w-4 tw-h-4 tw-border-green-600 tw-rounded-full"></div>
                </q-item-section>
                <div class="tw-mt-2">
                  <div class="tw-text-sm md:tw-text-lg text-purple tw-font-serif">
                    {{ attendance.title }}
                  </div>
                  <div class="md:tw-text-base text-purple tw-font-mono">
                    {{ attendance.first_name }} {{ attendance.last_name }}
                    <p class="text-purple tw-mb-4 tw-text-xs">{{ attendance.status }} at 12:45 am</p>                
                  </div>
                </div>
              </div>
              <div class="tw-mt-5">
                <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="attendance.status === 'admitted'" color="positive" label="Approved" />
                <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="attendance.status === 'cancel'" color="negative" label="Cancelled" />
                <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="attendance.status == 'pending' " color="warning" label="Pending" /> 
              </div>
            </div>
          </div>
          <div class="q-pa-lg flex tw--mt-6 md:tw--mt-0 flex-center">
            <q-pagination
              v-model="attendances"
              :max="5"
              direction-links
            />
          </div>
      </div>
      <visitors-list
        
      ></visitors-list>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useAttendanceService } from '../composables/attendanceService';
import VisitorsList from '../components/VisitorsList.vue'

const attendanceList = [
  {
    id: "1",    
    title: "Senator",
    first_name: "Musa",    
    last_name: "Muhammad",    
    email: "musamohd@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-public-domain-pictures-42059.jpg",
    status: 'admitted'
  },
  {
    id: "2",    
    title: "Mr",
    first_name: "Nasir",    
    last_name: "Lawal",    
    email: "nla@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-polina-tankilevitch-4518599.jpg",
    status: "pending"
  },
  {
    id: "3",    
    title: "Governor",
    first_name: "Ibrahim",    
    last_name: "Muazu",    
    email: "ibrahimmuaz@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-naman-nayar-922764.jpg",
    status: 'admitted'
  },
  {
    id: "4",    
    title: "Chairman",
    first_name: "Isah",    
    last_name: "Ahmad",    
    email: "isah2312@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-ready-made-3850652.jpg",
    status: 'cancel'
  },
  {
    id: "5",    
    title: "Rep",
    first_name: "Muhammada",    
    last_name: "Junaid",    
    email: "mohdjunnaid@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-pixabay-161559.jpg",
    status: 'cancel'
  },
  {
    id: "6",    
    title: "Mrs",
    first_name: "Farida",    
    last_name: "Aliyu",    
    email: "farido@gmail.com",
    phone: "08109342356",
    gender: "female",
    image: "/img/pexels-wendy-wei-1656666.jpg",
    status: "pending"
  },
  {
    id: "7",    
    title: "Developer",
    first_name: "Nasir",    
    last_name: "Ibrahim",    
    email: "nasirib@gmail.com",
    phone: "08109342356",
    gender: "male",
    image: "/img/pexels-julia-volk-5273044.jpg",
    status: 'admitted'
  }
]

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
        to: { name: 'visitors' }
      },
      {
        title: 'Search Visitor',
        icon: 'search',
        to: { name: 'visitors' }
      }
    ]
  },
];

export default defineComponent({
  name: 'MainLayout',
  components: {
    VisitorsList
  },

  setup () {
    const leftDrawerOpen = ref(false);
    const attendance = useAttendanceService()
    const attendances = ref(null)

    attendances.value = attendance.list()
    console.log(attendances.value);
    const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value }

    return {
      links: linksData,
      leftDrawerOpen,
      toggleLeftDrawer,
      attendances: attendanceList
      
    }
  }
})
</script>
