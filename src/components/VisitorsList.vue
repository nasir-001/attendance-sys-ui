<template>
  <div class="q-pa-md q-mt-lg xl:tw-w-5/6 tw-mx-auto">
    <q-table
      title="Expected Visitors"
      :rows="rows"
      :columns="columns"
      :visibleColumns="visibleColumns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="image" :props="props">
            <q-img class="tw-w-12 tw-h-12 md:tw-w-16 md:tw-h-16 tw-object-cover tw-rounded-lg hover:tw-shadow-md" :src="props.row.image" />
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="first_name" :props="props">
            {{ props.row.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row.last_name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status === 'admitted'" color="positive" label="Approved" />
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status === 'cancel'" color="negative" label="Cancelled" />
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status == 'pending' " color="warning" label="Pending" /> 
          </q-td>
          <q-td>
            VIEW            
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { computed, defineComponent, ref} from 'vue';
import { useAttendanceService } from '../composables/attendanceService';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'image',
    required: true,
    label: 'IMAGE',
    align: 'left',
    field: row => row.image,
  },
  { name: 'title', label: 'TITLE', align: 'left', field: 'title' },
  { name: 'first_name', label: 'FIRST NAME', align: 'left', field: 'first_name' },
  { name: 'last_name', label: 'LAST NAME', align: 'left', field: 'last_name' },
  { name: 'phone', label: 'PHONE', align: 'left', field: 'phone' },
  { name: 'email', label: 'EMAIL', align: 'left', field: 'email' },
  { name: 'status', label: 'STATUS', align: 'left', field: 'status' },
  { name: 'view', label: 'VIEW', align: 'left', field: 'view' }
]

const rows = [
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
    first_name: "Muhammadu",    
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
    status: 'admitted',
  }
]

export default defineComponent({
  name: 'VisitorsList',

  async setup () {
    const attendance = useAttendanceService()
    const attendances = ref([])
    const $q = useQuasar()

    const visibleColumns = computed(() => {
      return $q.screen.gt.xs
        ? ['image', 'title', 'first_name', 'last_name', 'phone', 'email', 'status', 'view']
        : ['image', 'title', 'first_name', 'view']
    })

    attendances.value = await attendance.list()
    return {
      columns,
      rows,
      visibleColumns
    }
  }
})
</script>