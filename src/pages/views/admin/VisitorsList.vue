<template>  
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <div class="q-pa-md q-mt-lg tw-w-full xl:tw-w-5/6 tw-mx-auto">
      <div class="tw-flex tw-justify-start">
        <div>
          <q-btn
            icon="filter_list"
            outline
            @click="showFilter"
            label="filter"
            class="q-mb-md q-px-sm text-grey-8"
          />
        </div>
        <div v-if="filterForm">
          <q-input 
            class="tw-w-56 tw-ml-4" 
            outlined 
            v-model="filter.first_name"
            bottom-slots 
            label="search by name"
            dense
          >
          </q-input>
        </div>
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
        title="Expected Visitors"
        :filter="filter"
        :filter-method="filterData"
        :loading="tableIsLoading"
      >
        <template v-slot:loading>
          <q-spinner-tail
            color="primary"
            size="3em"
            class="tw-mx-auto"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="image" :props="props">
              <div class="tw-flex tw-justify-start tw-ml-3">
                <div class="tw--ml-3 sm:tw--ml-2 tw-text-center tw-font-thin tw-font-mono tw-w-12 tw-h-12 tw-overflow-hidden tw-shadow-lg md:tw-w-14 md:tw-h-14 tw-object-cover tw-rounded-full hover:tw-shadow-md" :style="{'background-color': getAvatarBackgroundColor(props.row.visitor.first_name)}">
                  <p class="tw-text-xl tw--mt-1 tw-pt-3 sm:tw-pt-4 tw-text-gray-300">{{ props.row.visitor.first_name[0].toUpperCase() }}{{ props.row.visitor.last_name[0].toUpperCase() }}</p>
                </div>
                <q-badge v-if="props.row.status === 'admitted'" color="positive" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                <q-badge v-if="props.row.status === 'cancelled'" color="negative" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                <q-badge v-if="props.row.status === 'pending'" color="warning" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
                <q-badge v-if="props.row.status === 'finished'" color="primary" class="sm:tw--mr-10 sm:tw-w-4 sm:tw-h-4 tw-mt-8 sm:tw-mt-10 tw--ml-4 tw-rounded-full tw-border-2"></q-badge>
              </div>
            </q-td>
            <q-td key="title" :props="props">
              {{ props.row.visitor.title }}
            </q-td>
            <q-td key="first_name" :props="props">
              {{ props.row.visitor.first_name }}
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.visitor.last_name }}
            </q-td>
            <q-td key="phone" :props="props">
              {{ props.row.visitor.phone }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.visitor.email }}
            </q-td>
            <q-td key="status" :props="props">
              <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status === 'admitted'" color="positive" label="Admitted" />
              <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status === 'cancelled'" color="negative" label="Cancelled" />
              <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status == 'pending' " color="warning" label="Pending" /> 
              <q-badge class="tw-py-1 tw-px-1 sm:tw-py-1.5 sm:tw-px-2 tw-right-0 tw-uppercase" v-if="props.row.status == 'finished' " color="primary" label="Departed" /> 
            </q-td>
            <q-td key="view" :props="props">
              <q-btn 
                label="View" 
                dense 
                color="primary" 
                class="tw-text-xs tw-py-2 tw-px-3 sm:tw-mr-2" 
                :to="{ name: 'admin-visitor-details', params: { id: props.row.uuid } }" 
              />
            </q-td>
          </q-tr>
        </template>  
      </q-table>
      <q-btn
        round
        class="tw-float-right tw-mt-4 tw-bottom-2"
        color="primary"
        size="16px"
        icon="add"
        :to="{ name: 'admin-new-visitor' }"
      />
    </div>
  </transition>
</template>

<script>
import { computed, defineComponent, ref, reactive} from 'vue';
import { useAttendanceService } from '../../../composables/attendanceService';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { getMetaData } from 'boot/utils';
import { getAvatarBackgroundColor, filterData } from 'boot/utils';
import jwt_decode from 'jwt-decode';

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
  { name: 'status', label: 'STATUS', align: 'center', },
  { name: 'view', label: '', align: 'right', }
];

export default defineComponent({
  name: 'VisitorsList',
  mixins: [getMetaData('Visitors List')],

  async setup () {
    const attendance = useAttendanceService()
    const rows = ref([]);
    const filterForm = ref(false);
    const showTable = ref(false);
    const queryName = ref('');
    const tableIsLoading = ref(false)
    const $q = useQuasar();
    getVisitorList()

    const visibleColumns = computed(() => {
      return $q.screen.gt.xs
        ? ['image', 'title', 'first_name', 'last_name', 'phone', 'status', 'view']
        : ['image', 'first_name', 'last_name', 'status', 'view']
    });

    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function hasPermission (token, permission) {
      // eslint-disable-next-line
      const authPayload = jwt_decode(token)
      const hasperm = authPayload.data.permissions.indexOf(permission)
      return hasperm > -1
    }

    function getVisitorList() {
      tableIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/visit/all/today')
        .then((response) => {
          rows.value = response.data;
          tableIsLoading.value = false;
        })
        .catch((error) => {
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 5000,
            position: 'top',
            message: 'Failed to load visitors'
          })
        })
    }

    const showFilter = () => {
      setTimeout(() => {
        filterForm.value = !filterForm.value;
      }, 500);
    };

    setTimeout(() => {
      showTable.value = !showTable.value;
    }, 500);

     const filter = reactive({
        first_name: '',
      });

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
      showTable,
      tableIsLoading,
      hasPermission
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

</style>