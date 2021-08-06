<template>
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
            User Roles
          </div>
          <div
            :class="[
              $q.screen.lt.sm ? 'text-center' : '',
              'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
            ]"
          >
            User Roles
          </div>
          <div class="col-12 col-sm-6">
            <q-btn
              no-caps
              color="primary"
              label="Add New Role"
              @click="newRole = true"
              :disable="tableIsLoading"
              :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']"
            />
          </div>
        </div>
      </div>

      <!-- Roles Table -->
      <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
        <q-table
          row-key="name"
          class="col-12"
          :rows-per-page-options="[10, 25, 50, 0]"
          :rows="rolesList"
          :columns="columns"
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
          <template v-slot:body-cell-role="props">
            <q-td
              :props="props"
              class="text-primary"
              @click="$router.push({
                name: 'role-detail',
                params: { roleName: props.row.name }
              })"
            >
              {{ props.row.name }}
            </q-td>
          </template>

          <template v-slot:body-cell-delete="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="delete"
                class="q-mr-md"
                color="negative"
                @click="makeDeletePayload(props.row.name)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- New role modal/dialog -->
    <q-dialog v-model="newRole" no-backdrop-dismiss>
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="text-center">
          <div class="text-h5">New Role</div>
          <div class="text-subtitle2">Add new user role</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <form v-on:submit.prevent="addNewRole" class="q-gutter-md">
              <q-input
                ref="name"
                outlined
                autofocus
                type="text"
                label="Name"
                bottom-slots
                v-model="newRolePayload.name"
                :rules="[ val => !!val || 'This field is required.' ]"
              />
              <q-input
                autogrow
                outlined
                label="Description"
                v-model="newRolePayload.description"
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
                  :loading="newRoleBtnLoading"
                  :disabled="newRoleBtnLoading || !newRolePayload"
                />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete role modal/dialog -->
    <q-dialog v-model="confirmRoleDelete" persistent>
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-center">
            Confirm Permanent Delete?
          </div>
        </q-card-section>
        <q-card-section class="row items-center q-pb-md">
          <span class="q-ml-sm text-body1">Are you sure you want to delete <strong>{{ deleteRolePayload }}</strong>?</span>
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
            label="Delete Role"
            @click="deleteRole"
            :loading="deleteBtnIsLoading"
            :disabled="deleteBtnIsLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent, ref, reactive } from 'vue';
import BackButton from '../../components/BackButton.vue';
import { useAttendanceService } from '../../composables/attendanceService';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const tableCols = [
  { name: 'role', label: 'ROLES', field: 'name', align: 'left', classes: 'cursor-pointer', sortable: true },
  { name: 'delete', label: '', align: 'right' }
]

export default defineComponent({
  name: 'Roles',
  components: {
    BackButton
  },

  async setup() {
    const tableIsLoading = ref(false);
    const rows = ref([]);
    const deleteRolePayload = ref('');
    const confirmRoleDelete = ref(false);
    const newRole = ref(false);
    const newRoleBtnLoading = ref(false);
    const deleteBtnIsLoading = ref(false);
    const rolesList = ref([])
    const $q = useQuasar()
    getRolesList()
    const newRolePayload = reactive({
      name: '',
      description: ''
    })
    const newRoleError = reactive({
      status: false,
      message: ''
    })

    function getAuthToken() {
      return $q.localStorage.getItem('authToken')
    }

    function makeDeletePayload (payload) {
      deleteRolePayload.value = payload;
      confirmRoleDelete.value = true;
    }

    function getRolesList() {
      if (rolesList.value.length === 0) {
        tableIsLoading.value = true;
      }
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.get(`/api/roles`)
      .then((response) => {
        rolesList.value = response.data;
        tableIsLoading.value = false;
      })
    }

    function addNewRole () {
      newRoleBtnLoading.value = true;
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.post(`/api/permissions/`, newRolePayload)
      .then(() => {
        newRolePayload.name = '';
        newRolePayload.description = '';
        newRoleBtnLoading.value = false;
        newRole.value = false;
        $q.notify({
          icon: 'done',
          type: 'positive',
          timeout: 5000,
          position: 'top',
          message: 'Role added successfully'
        })
      })
      .catch((error) => {
        newRoleError.message = error.response.data.detail
        newRoleError.status = true
        newRoleBtnLoading.value = false
      })
    }

    function deleteRole() {
      deleteBtnIsLoading.value = true;
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.delete(`/roles/${deleteRolePayload.value}`)
      .then(() => {
        deleteRolePayload.value = '';
        deleteBtnIsLoading.value = false;
        getRolesList();
        confirmRoleDelete.value = false;
        $q.notify({
          icon: 'done',
          type: 'positive',
          timeout: 7000,
          position: 'top',
          message: 'Role deleted successfully'
        })
      })
      .catch((error) => {
        if (error.response.status === 403) {
          confirmRoleDelete.value = false;
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 7000,
            position: 'top',
            message: error.response.data.detail
          })
          deleteRolePayload.value = '';
          deleteBtnIsLoading.value = false;
        }
      })
    }

    return {
      rows,
      columns: tableCols,
      tableIsLoading,
      makeDeletePayload,
      newRole,
      addNewRole,
      newRolePayload,
      newRoleBtnLoading,
      rolesList,
      confirmRoleDelete,
      deleteRolePayload,
      deleteRole,
      deleteBtnIsLoading
    }

  },
})
</script>