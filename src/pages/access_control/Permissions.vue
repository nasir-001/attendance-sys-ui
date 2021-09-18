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
              User Permissions
            </div>
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
              ]"
            >
              User Permissions
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                no-caps
                color="primary"
                :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']"
                label="Add New Permission"
                @click="newPerm = true"
                :disabled="tableIsLoading"
              />
            </div>
          </div>
        </div>

        <!-- Permissions Table -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
          <q-table
            row-key="name"
            class="col-12"
            :columns="tableCols"
            :rows="permissionsList"
            :loading="tableIsLoading"
            table-header-class="bg-blue-1 text-blue-10"
          >
            <template v-slot:loading>
              <q-spinner-tail
                color="primary"
                size="3em"
                class="tw-mx-auto"
              />
            </template>
            <template v-slot:body-cell-delete="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  class="sm:tw-mr-3"
                  color="negative"
                  @click="makeDeletePayload(props.row.name)"
                >
                  <q-tooltip :delay="1000" anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    Delete permission
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <!-- New permission modal/dialog -->
      <q-dialog v-model="newPerm" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">New Permission</div>
            <div class="text-subtitle2">Add new user permission</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent="addNewPermission" class="q-gutter-md">
                <q-input
                  ref="name"
                  outlined
                  autofocus
                  type="text"
                  label="Name"
                  v-model="newPermission.name"
                  bottom-slots
                  :error="permError.status"
                  :error-message="permError.message"
                  @focus="permError.status = false"
                  :rules="[ val => !!val || 'This field is required.' ]"
                />
                <q-input
                  autogrow
                  outlined
                  v-model="newPermission.description"
                  label="Description"
                />
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
                    label="Add new"
                    color="primary"
                    class="q-px-md"
                    :loading="newPermBtnLoading"
                    :disabled="newPermBtnLoading || !newPermission"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Delete permission modal/dialog -->
      <q-dialog v-model="confirmPermDelete" persistent>
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirm Permanent Delete?
            </div>
          </q-card-section>
          <q-card-section class="row items-center q-pb-md">
            <span class="q-ml-sm text-body1">Are you sure you want to delete <strong>{{ deletePermPayload }}</strong>?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              no-caps
              label="Cancel"
              color="grey-9"
              class="q-px-md"
              v-close-popup
            />
            <q-btn
              no-caps
              unelevated
              color="negative"
              class="q-px-md"
              label="Delete Permission"
              @click="deletePermission"
              :loading="deleteBtnIsLoading"
              :disable="deleteBtnIsLoading"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
  { name: 'permission', label: 'PERMISSIONS', field: 'name', align: 'left', sortable: true },
  { name: 'delete', label: '', align: 'right' }
]

export default defineComponent({
  name: 'Permission',
  mixins: [getMetaData('Permissions List')],
  components: {
    BackButton
  },

  async setup() {
    const $q = useQuasar();    
    const tableIsLoading = ref(false);
    const rows = ref([]);
    const newPerm = ref(false);
    const deletePermPayload = ref('');
    const confirmPermDelete = ref(false);
    const newPermBtnLoading = ref(false);
    const deleteBtnIsLoading = ref(false);
    getPermissionsList()
    const permissionsList = ref([]);
    
    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    const permError = reactive({
      status: false,
      message: ''
    })

    const newPermission = reactive({
      name: '',
      description: ''
    })

    function getPermissionsList() {
      tableIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/permissions')
        .then((response) => {
          permissionsList.value = response.data;
          tableIsLoading.value = false;
        })
    }

    function addNewPermission() {
      newPermBtnLoading.value = true;
      api.post('/permissions', newPermission)
        .then(() => {
          newPermission.name = '';
          newPermission.description = '';
          newPermBtnLoading.value = false;
          getPermissionsList();
          newPerm.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Permission added successfully'
          })
        })
        .catch((error) => {
          permError.message = error.response.data.detail;
          newPermBtnLoading.value = false;
          permError.status = true;
        })
    }

    function makeDeletePayload(payload) {
      deletePermPayload.value = payload;
      confirmPermDelete.value = true;
    }

    function deletePermission() {
      deleteBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.delete(`/permissions/${deletePermPayload.value}`)
        .then(() => {
          deleteBtnIsLoading.value = false;
          getPermissionsList()
          confirmPermDelete.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Permission deleted successfully'
          })
        })
        .catch((error) => {
          if(error.response.status === 403) {
            confirmPermDelete.value = false;
            $q.notify({
              icon: 'done',
              type: 'negative',
              timeout: 7000,
              position: 'top',
              message: error.response.data.detail
            })
          }
          deleteBtnIsLoading.value = false;
        })
    }

    return {
      tableCols,
      tableIsLoading,
      rows,
      newPerm,
      newPermission,
      addNewPermission,
      makeDeletePayload,
      confirmPermDelete,
      deletePermission,
      deleteBtnIsLoading,
      deletePermPayload,
      permissionsList,
      permError,
      newPermBtnLoading
    }
  },
})
</script>