<template>
  <div class="q-pa-md">
    <q-table
      class="text-grey-8"
      title="Expected Visitors"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="image" :props="props">
            <q-img :src="image" />
          </q-td>
          <q-td key="title" :props="props">{{ props.title }}</q-td>
          <q-td key="first_name" :props="props">{{ props.first_name }}</q-td>
          <q-td key="last_name" :props="props">{{ props.last_name }}</q-td>
          <q-td key="phone" :props="props">{{ props.phone }}</q-td>
          <q-td key="email" :props="props">{{ props.email }}</q-td>
          <q-td key="status" :props="props">
            <q-badge class="tw-py-1 tw-px-2 tw-right-0" color="positive" label="Approved" />
          </q-td>
          <q-td key="view" :props="props">
            <q-btn size="10px" color="primary" label="View" icon-right="visibility" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref} from 'vue';

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Image',
    align: 'left',
    field: row => row.image,
  },
  { name: 'title', label: 'Title', field: 'title' },
  { name: 'first_name', label: 'First Name', field: 'first_name' },
  { name: 'last_name', label: 'Last Name', field: 'last_name' },
  { name: 'phone', label: 'Phone', field: 'phone' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'status', label: 'Status', field: 'status' },
  { name: 'view', label: 'View', field: 'view' }
]

export default defineComponent({
  name: 'VisitorsList',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    gender: {
      type: String
    },
    image: {
      type: String
    },
    status: {
      type: String
    },
  },

  setup () {
    return {
      columns
    }
  }
})
</script>