<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutleft">
    <q-page padding>
      <div class="row q-pb-xl justify-center q-gutter-sm-md">
        <!-- Title -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl" v-if="!notFound">
          <back-button />
          <div class="row">
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h5 q-pb-md q-pl-sm lt-sm'
              ]"
            >
              {{ roleObj.name }}
            </div>
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
              ]"
            >
              {{ roleObj.name }}
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                no-caps
                color="primary"
                @click="addPerm = true"
                :disabled="tableIsLoading"
                label="Add Permission to Role"
                :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']"
              />
            </div>
          </div>
        </div>
        <!-- Permiions Table -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
          <not-found-404 back v-if="notFound" />
          <q-table
            row-key="name"
            class="col-12"
            :columns="columns"
            :loading="tableIsLoading"
            :rows="roleObj.permissions"
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
            <template v-slot:body-cell-remove="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  class="q-mr-md"
                  color="negative"
                  @click="removePermFromRole(props.row.name)"
                  icon="delete"
                >
                  <q-tooltip :delay="1000" anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    Remove permission
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Add permission modal/dialog -->
      <q-dialog v-model="addPerm" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">Add Permission</div>
            <div class="text-subtitle2">Add permission to Role</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent="addPermToRole" class="q-gutter-md">
                <q-select
                  ref="name"
                  outlined
                  use-input
                  type="text"
                  label="Name"
                  bottom-slots
                  @filter="filterFn"
                  :options="options"
                  :error="permError.status"
                  :error-message="permError.message"
                  v-model="addPermPayload"
                  :rules="[ val => !!val || 'This field is required.' ]"
                  @input="permError.status = false"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-card-actions align="right" class="q-pt-lg q-pr-none">
                  <q-btn
                    flat
                    label="Cancel"
                    color="primary"
                    class="q-px-md"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    color="primary"
                    class="q-px-md"
                    label="Add permission"
                    :disabled="addPermBtnLoading || !addPermPayload"
                    :loading="addPermBtnLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import BackButton from '../../components/BackButton.vue';
import NotFound404 from '../../components/NotFound404.vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

const tableCols = [
  { name: 'permission', label: 'ROLE PERMISSIONS', field: 'name', align: 'left', sortable: true },
  { name: 'remove', label: '', align: 'right' }
]

export default defineComponent({
  name: 'RoleDetail',
  components: {
    BackButton,
    NotFound404
  },

  setup() {
    const notFound = ref(false);
    const roleObj = ref({});
    const permsList = ref([]);
    const options = ref([]);
    const $q = useQuasar();
    const route = useRoute()
    const tableIsLoading = ref(false);
    const addPermPayload = ref('');
    const addPerm = ref(false);
    const addPermBtnLoading = ref(false);
    const permError = reactive({
      status: false,
      message: ''
    })
    getAllPermissions()
    getRoleDetail()

    const allPermissions = computed(() => {
      const rolePermissions = roleObj.value.permissions.map((perm) => {
          return perm.name;
        });
        const perms = permsList.value.map((perm) => {
          return perm.name
        });
        return perms.filter(perm => rolePermissions.indexOf(perm) === -1)
    })

    function filterFn (val, update) {
      if (val === '') {
        update(() => {
          options.value = allPermissions.value;
        })
        return
      };
      update(() => {
        const needle = val.toLowerCase();
        options.value = allPermissions.value.filter(v => v.toLowerCase().indexOf(needle) > -1);
      })
    }

    function getAuthToken () {
      return $q.localStorage.getItem('authToken');
    }

    function getAllPermissions () {
      if (!roleObj.value.name) {
        tableIsLoading.value = true;
      }
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.get('/api/permissions/')
        .then((response) => {
          permsList.value = response.data
        })
    }

    function getRoleDetail () {
      if (!roleObj.value) {
        tableIsLoading.value = true;
      }
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.get(`/api/roles/${route.params.roleName}`)
        .then((response) => {
          roleObj.value = response.data;
          tableIsLoading.value = false;
        })
        .catch((error) => {
          if(error.response.status === 404) {
            tableIsLoading.value = false;
            notFound.value = true;
          }
        })
    }

    function addPermToRole () {
      addPermBtnLoading.value = true;
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.put(`/api/roles/${roleObj.value.name}`, { permissions: [addPermPayload.value] })
        .then(() => {
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Permission added successfully',
          })
          addPermBtnLoading.value = false;
          getRoleDetail();
          getAllPermissions();
          addPerm.value = false;
          addPermPayload.value = '';
      })
    }

    function removePermFromRole (perm) {
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.delete(`/api/roles/${roleObj.value.name}/permissions`, { data: { permissions: [perm] } })
        .then((response) => {
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Permission removed successfully'
          })
          getRoleDetail()
          getAllPermissions()
        })
        .catch(() => {
          if (error.response.status === 404){
            $q.notify({
              icon: 'warning',
              type: 'negative',
              timeout: 5000,
              position: 'top',
              message: error.response.data.detail
            })
          }
        })
    }

    return {
      notFound,
      roleObj,
      tableIsLoading,
      columns: tableCols,
      addPerm,
      filterFn,
      removePermFromRole,
      options,
      permError,
      addPermPayload,
      addPermToRole,
      addPermBtnLoading
    }
    
  },
})
</script>