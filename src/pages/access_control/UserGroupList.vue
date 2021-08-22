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
              User Groups
            </div>
            <div
              :class="[
                $q.screen.lt.sm ? 'text-center' : '',
                'col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs'
              ]"
            >
              User Groups
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                no-caps
                color="primary"
                label="Add New Group"
                @click="newGroup = true"
                :disable="tableIsLoading"
                :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']"
              />
            </div>
          </div>
        </div>

        <!-- Groups Table -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-pt-lg q-pt-sm-none">
          <q-table
            row-key="name"
            class="col-12"
            :columns="columns"
            :rows="groupsList"
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

            <template v-slot:body-cell-group="props">
              <q-td
                :props="props"
                class="text-primary"
                @click="$router.push({
                  name: 'group-detail',
                  params: { groupName: props.row.name }
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

      <!-- New Group modal/dialog -->
      <q-dialog v-model="newGroup" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">New Group</div>
            <div class="text-subtitle2">Add new user group</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent="addNewGroup" class="q-gutter-md">
                <q-input
                  ref="name"
                  outlined
                  autofocus
                  type="text"
                  label="Name"
                  bottom-slots
                  :error="newGroupError.status"
                  :error-message="newGroupError.message"
                  v-model="newGroupPayload.name"
                  :rules="[ val => !!val || 'This field is required.' ]"
                  @input="newGroupError.status = false"
                />
                <q-input
                  autogrow
                  outlined
                  label="Description"
                  v-model="newGroupPayload.description"
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
                    :disabled="newGroupBtnLoading"
                    :loading="newGroupBtnLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Delete group modal/dialog -->
      <q-dialog v-model="confirmGroupDelete" persistent>
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirm Permanent Delete?
            </div>
          </q-card-section>
          <q-card-section class="row items-center q-pb-md">
            <span class="q-ml-sm text-body1">Are you sure you want to delete <strong>{{ deleteGroupPayload }}</strong>?</span>
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
              label="Delete Group"
              @click="deleteGroup"
              :loading="deleteBtnIsLoading"
              :disabled="deleteBtnIsLoading"
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
import { useQuasar } from 'quasar';

const tableCols = [
  { name: 'group', label: 'GROUPS', field: 'name', align: 'left', classes: 'cursor-pointer', sortable: true },
  { name: 'delete', label: '', align: 'right' }
]

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BackButton
  },

  setup() {
    const tableIsLoading = ref(false);
    const groupsList = ref([]);
    const newGroupBtnLoading = ref(false);
    const newGroup = ref(false);
    const confirmGroupDelete = ref(false);
    const deleteBtnIsLoading = ref(false);
    const $q = useQuasar();
    
    const newGroupError = reactive({
      status: false,
      message: ''
    })

    const newGroupPayload = reactive({
      name: '',
      description: ''
    })

    const deleteGroupPayload = ref('')
    getGroupsList();

    function getAuthToken () {
      return $q.localStorage.getItem('authToken');
    }

    function getGroupsList () {
      if (groupsList.value.length === 0) {
        tableIsLoading.value = true;
      }
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/groups')
        .then((response) => {
          groupsList.value = response.data;
          tableIsLoading.value = false;
        })
    }

    function addNewGroup () {
      newGroupBtnLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.post('/groups', newGroupPayload)
        .then(() => {
          newGroupPayload.name = '';
          newGroupPayload.description = '';
          newGroupBtnLoading.value = false;
          newGroup.value = false;
          getGroupsList()
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'Group added successfully'
          })
        })
        .catch((error) => {
          newGroupError.message = error.response.data.detail;
          newGroupError.status = true;
          newGroupBtnLoading.value = false;
        })
    }

    function makeDeletePayload (payload) {
      deleteGroupPayload.value = payload;
      confirmGroupDelete.value = true;      
    }

    function deleteGroup () {
      deleteBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.delete(`/groups/${deleteGroupPayload.value}`)
        .then(() => {
          deleteBtnIsLoading.value = false;
          getGroupsList();
          confirmGroupDelete.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Group deleted successfully'
          })
        })
        .catch((error) => {
          if (error.response.status === 403) {
            confirmGroupDelete.value = false;
            $q.notify({
              icon: 'done',
              type: 'negative',
              timeout: 7000,
              position: 'top',
              message: error.response.data.detail
            })
            deleteBtnIsLoading.value = false;
          }
        })
    }

    return {
      tableIsLoading,
      columns: tableCols,
      groupsList,
      makeDeletePayload,
      newGroup,
      newGroupError,
      newGroupPayload,
      newGroupBtnLoading,
      confirmGroupDelete,
      deleteGroupPayload,
      deleteGroup,
      deleteBtnIsLoading,
      addNewGroup
    }
    
  },
})
</script>