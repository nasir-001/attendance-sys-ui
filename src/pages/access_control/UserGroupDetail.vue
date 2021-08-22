<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft">
    <q-page padding>
      <div class="row q-pb-xl justify-center q-gutter-sm-md" v-if="!notFound">
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
              {{ groupObj.name }}
            </div>
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
              ]"
            >
              {{ groupObj.name }}
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                no-caps
                color="primary"
                class="float-right"
                @click="addRole = true"
                label="Add Role to Group"
                :disable="tableIsLoading"
                :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']"
              />
            </div>
          </div>
        </div>

        <!-- Roles Table -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
          <not-found-404 back v-if="notFound" />
          <q-table
            row-key="name"
            class="col-12"
            :rows-per-page-options="[10, 25, 50, 0]"
            :columns="columns"
            :rows="groupObj.roles"
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
              <q-td :props="props" auto-width>
                <q-expansion-item
                  dense
                  expand-separator
                  switch-toggle-side
                  expand-icon-toggle
                  :content-inset-level="1"
                  :label="props.row.name"
                  caption="Click arrow to view/hide role's permissions"
                >
                  <div class="q-pl-sm col-6" style="max-width: 400px !important;">
                    <q-chip
                      v-for="perm in props.row.permissions"
                      :key="perm.id"
                      color="blue-1"
                      dense
                    >
                      {{ perm.name }}
                    </q-chip>
                  </div>
                </q-expansion-item>
              </q-td>
            </template>

            <template v-slot:body-cell-remove="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  class="q-mr-md"
                  color="negative"
                  @click="removeRoleFromGroup(props.row.name)"
                  icon="delete"
                >
                  <q-tooltip :delay="1000" anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    Remove role
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Add role modal/dialog -->
      <q-dialog v-model="addRole" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">Add Role</div>
            <div class="text-subtitle2">Add role to user group</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent="addRoleToGroup" class="q-gutter-md">
                <q-select
                  ref="name"
                  outlined
                  use-input
                  type="text"
                  label="Name"
                  bottom-slots
                  @filter="filterFn"
                  :options="options"
                  :error="roleError.status"
                  :error-message="roleError.message"
                  v-model="addRolePayload"
                  :rules="[ val => !!val || 'This field is required.' ]"
                  @input="roleError.status = false"
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
                    label="Add role"
                    color="primary"
                    class="q-px-md"
                    :loading="addRoleBtnLoading"
                    :disabled="addRoleBtnLoading || !addRolePayload"
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
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import NotFound404 from '../../components/NotFound404.vue';

const tableCols = [
  { name: 'role', label: 'GROUP ROLES', field: 'name', align: 'left', sortable: true },
  { name: 'remove', label: '', align: 'right' }
]

export default defineComponent({
  name: 'UserGroupDetail',
  components: {
    BackButton,
    NotFound404
  },

  setup() {
    const notFound = ref(false);
    const tableIsLoading = ref(false);
    const groupObj = ref({});
    const rolesList = ref([]);
    const options = ref([]);
    const $q = useQuasar();
    const route = useRoute();
    const addRoleBtnLoading = ref(false);
    const addRolePayload = ref('');
    const addRole = ref(false);
    const roleError = reactive({
      status: false,
      message: ''
    })
    getAllRoles();
    getGroupDetail();

    const allRoles = computed(() => {
      const groupRoles = groupObj.value.roles.map((role) => {
          return role.name;
        });
        const roles = rolesList.value.map((role) => {
          return role.name
        });
        return roles.filter(role => groupRoles.indexOf(role) === -1)
    })

    function filterFn (val, update) {
      if (val === '') {
        update(() => {
          options.value = allRoles.value;
        })
        return
      };
      update(() => {
        const needle = val.toLowerCase();
        options.value = allRoles.value.filter(v => v.toLowerCase().indexOf(needle) > -1);
      })
    }

    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function getAllRoles () {
      if (!groupObj.value) {
        tableIsLoading.value = true;
      }
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/api/roles')
        .then((response) => {
          rolesList.value = response.data;
        })
    }

    function getGroupDetail () {
      if (!groupObj.value.name) {
        tableIsLoading.value = true;
      }
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get(`/api/groups/${route.params.groupName}`)
        .then((response) => {
          groupObj.value = response.data;
          tableIsLoading.value = false;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            tableIsLoading.value = false;
            notFound.value = true;
          }
      })
    }

    function addRoleToGroup () {
      addRoleBtnLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.put(`/api/groups/${groupObj.value.name}`, { roles: [addRolePayload.value] })
        .then(() => {
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Role added successfully'
          })
          addRoleBtnLoading.value = false;
          getGroupDetail();
          getAllRoles();
          addRole.value = false;
          addRolePayload.value = '';
      })
    }

    function removeRoleFromGroup (role) {
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.delete(`/api/groups/${groupObj.value.name}/roles`, { data: { roles: [role] } })
        .then(() => {
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Role removed successfully'
          })
          getGroupDetail();
          getAllRoles();
        })
        .catch((error) => {
          if (error.response.status === 404) {
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
      tableIsLoading,
      columns: tableCols,
      groupObj,
      removeRoleFromGroup,
      addRole,
      filterFn,
      options,
      roleError,
      addRolePayload,
      addRoleBtnLoading,
      addRoleToGroup
    }
    
  },
})
</script>