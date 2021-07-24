<template>  
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <q-page>
      <back-button></back-button>
      <div v-if="showTable" class="q-pa-md tw-w-full xl:tw-w-5/6 tw-mx-auto">
        <q-btn 
        dense
        icon="filter_list"
        outline
        @click="showFilter"
        label="filter"
        class="q-mb-md q-px-sm text-grey-8"
      />
      <div v-if="filterForm">
        <q-input 
          class="tw-w-40" 
          outlined 
          v-model="filter.first_name"
          bottom-slots 
          label="Search by name"
          dense
        >
        </q-input>
      </div>

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
          title="All Visitors"
          :filter="filter"
          :filter-method="filterData"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="image" :props="props">
                <div class="tw-flex tw-justify-start">
                  <div class="tw--ml-3 sm:tw--ml-2 tw-text-center tw-font-thin tw-font-mono tw-w-12 tw-h-12 tw-overflow-hidden tw-shadow-lg md:tw-w-14 md:tw-h-14 tw-object-cover tw-rounded-full hover:tw-shadow-md" :style="{'background-color': getAvatarBackgroundColor(props.row.first_name)}">
                    <p class="tw-text-xl tw--mt-1 tw-pt-3 sm:tw-pt-4 tw-text-gray-300">{{ props.row.first_name[0].toUpperCase() }}{{ props.row.last_name[0].toUpperCase() }}</p>
                  </div>
                  <q-badge v-if="props.row.visit.status === 'admitted'" color="positive" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                  <q-badge v-if="props.row.visit.status === 'cancelled'" color="negative" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                  <q-badge v-if="props.row.visit.status === 'pending'" color="warning" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                  <q-badge v-if="props.row.visit.status === 'finished'" color="primary" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
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
                <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.visit.status === 'admitted'" color="positive" label="Admitted" />
                <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.visit.status === 'cancelled'" color="negative" label="Cancelled" />
                <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.visit.status == 'pending' " color="warning" label="Pending" /> 
                <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.visit.status == 'finished' " color="primary" label="Departed" /> 
              </q-td>
              <q-td key="view" :props="props" class="tw-mr-4">
                <q-btn :to="{ name: 'visitor-details', params: { id: props.row.id } }" label="View" dense color="primary" class="tw-text-xs tw-py-2 tw-px-3 tw--mr-2" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div v-else>
        <skeletal-table></skeletal-table>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { computed, defineComponent, ref, reactive} from 'vue';
import { useAttendanceService } from '../../composables/attendanceService';
import { useQuasar } from 'quasar';
import SkeletalTable from '../../components/SkeletalTable.vue';
import BackButton from '../../components/BackButton.vue';

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
  name: 'SearchVisitors',
  components: {
    SkeletalTable,
    BackButton
  },
  async setup () {
    const attendance = useAttendanceService()
    const rows = ref([])
    const queryName = ref('')
    const filterForm = ref(false)
    const showTable = ref(false)
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
        : ['image', 'first_name', 'last_name', 'status', 'view']
    })

    rows.value = await attendance.list()

    function getAvatarBackgroundColor(username) {
      const index = username.length % colors.length;
      return colors[index];
    }

    const showFilter = () => {
      setTimeout(() => {
        filterForm.value = !filterForm.value
      }, 500)
    }

    function filterData(rows, terms) {
      for (const term in terms) {
        rows = rows.filter(row =>
          (row[term] + '').toLowerCase().indexOf(terms[term].toLowerCase()) !== -1
        )
      }
      return rows
    }

    const filter = reactive({
      first_name: '',
    })

    setTimeout(() => {
      showTable.value = !showTable.value;
    }, 500);

    return {
      columns,
      rows,
      visibleColumns,
      getAvatarBackgroundColor,
      showFilter,
      filterForm,
      queryName,
      filterData,
      filter,
      showTable
    }
  }
})
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */

  .q-table__top,
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