<template>
  <div class="q-pa-md q-mt-lg tw-w-full xl:tw-w-5/6 tw-mx-auto">
    <q-table
      title="Expected Visitors"
      :rows="rows"
      :columns="columns"
      no-route-fullscreen-exit
      :visibleColumns="visibleColumns"
      row-key="name"
      binary-state-sort
      class="tw-text-gray-700"
    >
      <template class="tw-text-2xl" v-slot:body="props">
        <q-tr :props="props">
          <q-td key="image" :props="props">
            <div class="tw--ml-3 sm:tw--ml-2 tw-bg-transparent tw-text-center tw-text-xl tw-pt-3 tw-font-thin tw-font-mono tw-w-12 tw-h-12 tw-overflow-hidden tw-shadow-lg md:tw-w-14 md:tw-h-14 tw-object-cover tw-rounded-full sm:tw-rounded-2xl hover:tw-shadow-md" :style="{'background-color': nameHasing(props.row.first_name[1], props.row.first_name[-1]), 'color': nameHasing(props.row.first_name, props.row.first_name[-1])}">{{ props.row.first_name[0].toUpperCase() }}{{ props.row.last_name[0].toUpperCase() }}</div>
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
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status === 'admitted'" color="positive" label="Admitted" />
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status === 'cancel'" color="negative" label="Cancelled" />
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status == 'pending' " color="warning" label="Pending..." /> 
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" v-if="props.row.status == 'finish' " color="primary" label="Finished" /> 
          </q-td>
          <q-td class="tw-mr-4">
            <q-btn dense color="primary" class="tw-text-xs tw-px-2 tw--mr-2">View</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
   <q-btn
      round
      class="tw-float-right tw-mt-4 tw-bottom-0"
      color="primary"
      size="16px"
      icon="add"
      to="new-visitor"
    />
  </div>
</template>

<script>
import { computed, defineComponent, ref} from 'vue';
import { useAttendanceService } from '../composables/attendanceService';
import { useQuasar } from 'quasar';
import ColorHash from 'color-hash';

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
  { name: 'phone', label: 'PHONE', align: 'left', },
  { name: 'email', label: 'EMAIL', align: 'left', },
  { name: 'status', label: 'STATUS', align: 'left', },
  { name: 'view', label: '', align: 'righ', }
]

export default defineComponent({
  name: 'VisitorsList',

  async setup () {
    const attendance = useAttendanceService()
    const rows = ref([])
    const $q = useQuasar()
    const sizes = [ 'xs', 'sm', 'md', 'lg', 'xl' ]

    const visibleColumns = computed(() => {
      return $q.screen.gt.xs
        ? ['image', 'title', 'first_name', 'last_name', 'phone', 'email', 'status', 'view']
        : ['image', 'first_name', 'last_name', 'view']
    })

    rows.value = await attendance.list()

    function nameHasing(first, last) {
      const colorHash = new ColorHash()
      const fullName = `${first} ${last}`
      return `rgb(${colorHash.rgb(fullName)})`
    }

    return {
      columns,
      rows,
      visibleColumns,
      nameHasing
    }
  }
})
</script>