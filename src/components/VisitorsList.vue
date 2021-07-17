<template>  
  <transition
    appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideInRight"
  >
    <div class="q-pa-md q-mt-lg tw-w-full xl:tw-w-5/6 tw-mx-auto">
      <q-table
        :rows="rows"
        bordered
        :columns="columns"
        no-route-fullscreen-exit
        :visibleColumns="visibleColumns"
        row-key="name"
        binary-state-sort
        class="my-sticky-header-table"
        title-class="text-blue-10"
        table-header-class="text-blue-10"
        title="Expected Visitors"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="image" :props="props">
              <div class="tw--ml-3 sm:tw--ml-2 tw-text-center tw-font-thin tw-font-mono tw-w-12 tw-h-12 tw-overflow-hidden tw-shadow-lg md:tw-w-14 md:tw-h-14 tw-object-cover tw-rounded-full hover:tw-shadow-md" :style="{'background-color': getAvatarBackgroundColor(props.row.first_name)}">
                <p class="tw-text-xl tw-pt-2 sm:tw-pt-3 tw-text-gray-300">{{ props.row.first_name[0].toUpperCase() }}{{ props.row.last_name[0].toUpperCase() }}</p>
              </div>
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
              <q-badge class="tw-py-1.5 tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status === 'admitted'" color="positive" label="Admitted" />
              <q-badge class="tw-py-1.5 tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status === 'cancel'" color="negative" label="Cancelled" />
              <q-badge class="tw-py-1.5 tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status == 'pending' " color="warning" label="Pending..." /> 
              <q-badge class="tw-py-1.5 tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status == 'finish' " color="primary" label="Finished" /> 
            </q-td>
            <q-td class="tw-mr-4">
              <q-btn dense @click="toolbar = true" color="primary" class="tw-text-xs tw-py-2 tw-px-3 tw--mr-2">View</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      
      <q-dialog v-model="toolbar">
        <q-card>
          <q-toolbar>
            <q-avatar>
              <div class="tw--ml-3 sm:tw--ml-2 tw-text-center tw-font-thin tw-font-mono tw-w-12 tw-h-12 tw-overflow-hidden tw-shadow-lg md:tw-w-14 md:tw-h-14 tw-object-cover tw-rounded-full hover:tw-shadow-md">
                <p class="tw-text-xl tw-pt-2 sm:tw-pt-3 tw-text-gray-300">d</p>
              </div>
            </q-avatar>
            <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-card-section>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-btn
        round
        class="tw-float-right tw-mt-4 tw-bottom-0"
        color="primary"
        size="16px"
        icon="add"
        to="new-visitor"
      />
    </div>
  </transition>
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
  },
  { name: 'title', label: 'TITLE', align: 'left', },
  { name: 'first_name', label: 'FIRST NAME', align: 'left', },
  { name: 'last_name', label: 'LAST NAME', align: 'left', },
  { name: 'phone', label: 'PHONE', align: 'center', },
  { name: 'email', label: 'EMAIL', align: 'center', },
  { name: 'status', label: 'STATUS', align: 'center', },
  { name: 'view', label: '', align: 'right', }
]

export default defineComponent({
  name: 'VisitorsList',

  async setup () {
    const attendance = useAttendanceService()
    const rows = ref([])
    const $q = useQuasar()
    const colors = [
      '#1abc9c',
      '#2ecc71',
      '#3498db',
      '#3498db',
      '#9b59b6',
      '#34495e',
      '#16a085',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
      '#2c3e50',
    ];
    
    const visibleColumns = computed(() => {
      return $q.screen.gt.xs
        ? ['image', 'title', 'first_name', 'last_name', 'phone', 'email', 'status', 'view']
        : ['image', 'first_name', 'last_name', 'view']
    })

    rows.value = await attendance.list()

    function getAvatarBackgroundColor(username) {
      const index = username.length % colors.length;
      return colors[index];
    }

    return {
      icon: ref(false),
      bar: ref(false),
      bar2: ref(false),
      toolbar: ref(false),
      columns,
      rows,
      visibleColumns,
      getAvatarBackgroundColor
    }
  }
})
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: rgb(220, 231, 255)

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>