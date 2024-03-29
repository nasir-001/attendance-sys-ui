<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-page padding>
      <div class="row q-pb-xl justify-center q-gutter-sm-md">
        <!-- Title -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl">
          <back-button />
          <div class="row">
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h5 q-pb-md q-pl-sm lt-sm'
              ]"
            >
              Users List
            </div>
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
              ]"
            >
              Users List
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
          <q-table
            row-key="email"
            class="col-12"
            :columns="columns"
            :rows="userList"
            :loading="tableIsLoading"
            :rows-per-page-options="[10, 25, 50, 0]"
            table-header-class="bg-blue-1 text-blue-10"
          >
            <template v-slot:loading>
              <q-spinner-tail
                color="primary"
                size="3em"
                class="tw-mx-auto"
              />
            </template>
            
            <template v-slot:body-cell-firstname="props">
              <q-td
                :props="props"
                class="text-primary"
                @click="$router.push({
                  name: 'user-detail',
                  params: { uuid: props.row.uuid }
                })"
              >
                {{ props.row.firstname }}
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import BackButton from '../../components/BackButton.vue';
import { api } from 'boot/axios';
import { getMetaData } from 'boot/utils';
import { useQuasar } from 'quasar';

const tableCols = [
  { name: 'firstname', label: 'FIRST NAME', field: 'firstname', align: 'left', classes: 'cursor-pointer', sortable: true },
  { name: 'lastname', label: 'LAST NAME', field: 'lastname', align: 'left', sortable: true },
  { name: 'email', label: 'EMAIL', field: 'email', align: 'left', sortable: true }
]

export default defineComponent({
  name: 'UserList',
  mixins: [getMetaData('User List')],
  components: {
    BackButton
  },
  
  setup() {
    const userList = ref([]);
    const tableIsLoading = ref(false);
    const $q = useQuasar();
    getUserList();

    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function getUserList () {
      tableIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/users')
        .then((response) => {
          userList.value = response.data;
          tableIsLoading.value = false;
        })
    }
    
    return {
      columns: tableCols,
      tableIsLoading,
      userList
    }
  },
})
</script>