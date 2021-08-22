<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft">
    <q-page padding>
      <div class="row q-pb-xl justify-center q-gutter-sm-md">
        <!-- Title -->
        <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl">
          <back-button />
          <div class="row">
            <div class="col-12 col-sm-6 text-h5 q-pb-md q-pl-sm lt-sm">
              {{ userObj.firstname }}
            </div>
            <div class="col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs">
              {{ userObj.firstname }}
            </div>
            <div class="col-12 col-sm-6 q-gutter-sm">
              <q-btn
                no-caps
                color="primary"
                label="Edit User Info"
                @click="userEdit = true"
                :disabled="tableIsLoading"
                :class="[$q.screen.lt.sm ? 'q-mt-sm' : 'float-right']"
              />
              <q-btn
                no-caps
                outline
                color="primary"
                label="Change User Group"
                @click="groupEdit = true"
                :disabled="tableIsLoading"
                :class="[$q.screen.lt.sm ? 'q-mt-sm' : 'float-right']"
              />
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <not-found-404 v-if="notFound" back />

        <!-- Found -->
        <div v-else class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl tw-mt-3 sm:tw-mt-0">
          <!-- Loading Skeleton -->
          <div v-if="tableIsLoading" class="row justify-center q-pb-xl">
            <div class="col-12 q-gutter-sm q-pt-lg">
              <q-skeleton animation="pulse" type="QInput" />
              <q-skeleton animation="pulse" type="QInput" />
              <q-skeleton animation="pulse" type="QInput" />
              <q-skeleton animation="pulse" type="QInput" />
            </div>
          </div>

          <!-- User Detail -->
          <div v-else class="row">
            <div class="col-12">
              <q-input
                readonly
                outlined
                type="text"
                label="First Name"
                :model-value="userObj.firstname"
              />
              <q-input
                readonly
                outlined
                type="text"
                label="Last Name"
                :model-value="userObj.lastname"
              />
              <q-input
                readonly
                outlined
                type="text"
                label="Middle Name"
                :model-value="userObj.middlename"
              />
              <q-input
                readonly
                outlined
                type="text"
                label="Email"
                :model-value="userObj.email"
              />
              <q-input
                readonly
                outlined
                type="text"
                label="User Group"
                v-if="userObj.groups.length > 0"
                :model-value="userObj.groups[0].name"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Edit user modal/dialog -->
      <q-dialog v-model="userEdit" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">Edit User</div>
            <div class="text-subtitle2">Edit user information</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent.stop="editUser" class="q-gutter-md q-py-md">
                <q-input
                  outlined
                  type="text"
                  label="First Name"
                  v-model="userEditPayload.firstname"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  outlined
                  type="text"
                  label="Last Name"
                  v-model="userEditPayload.lastname"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-input
                  outlined
                  type="text"
                  bottom-slots
                  label="Middle Name (Optional)"
                  v-model="userEditPayload.middlename"
                />
                <q-input
                  outlined
                  type="email"
                  label="Email"
                  :error="emailError.status"
                  @input="emailError.status = false"
                  v-model="userEditPayload.email"
                  :error-message="emailError.message"
                  :rules="[
                    val => !!val || 'Field is required',
                    val => emailValidator(val)
                  ]"
                />
                <q-card-actions align="right" class="q-pb-lg q-pr-none">
                  <q-btn
                    flat
                    label="Cancel"
                    class="q-px-md"
                    color="primary"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    class="q-px-md"
                    color="primary"
                    label="Edit user info"
                    :disabled="editBtnIsLoading"
                    :loading="editBtnIsLoading"
                  />
                </q-card-actions>
              </form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Change user group modal/dialog -->
      <q-dialog v-model="groupEdit" no-backdrop-dismiss>
        <q-card style="width: 600px; max-width: 95vw;">
          <q-card-section class="text-center">
            <div class="text-h5">Change User Group</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <form @submit.prevent="changeUserGroup" class="q-gutter-md q-py-md">
                <q-select
                  outlined
                  label="User Group"
                  :options="groupOptions"
                  v-model="userOwnGroup"
                  :rules="[val => !!val || 'Field is required']"
                />
                <q-card-actions align="right" class="q-pr-none">
                  <q-btn
                    flat
                    label="Cancel"
                    class="q-px-md"
                    color="primary"
                    v-close-popup
                  />
                  <q-btn
                    type="submit"
                    class="q-px-md"
                    color="primary"
                    label="Change user group"
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
import { defineComponent, ref, reactive } from 'vue';
import BackButton from '../../components/BackButton.vue';
import { validateEmail } from 'boot/utils';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import NotFound404 from '../../components/NotFound404.vue';

export default defineComponent({
  name: 'UserDetail',
  components: {
    BackButton,
    NotFound404
  },
  
  setup() {
    const userObj = ref({});
    const userEdit = ref(false);
    const notFound = ref(false);
    const groupEdit = ref(false);
    const groupOptions = ref([]);
    const tableIsLoading = ref(false);
    const editBtnIsLoading = ref(false);
    const $route = useRoute();
    const $q = useQuasar();

    const emailError = reactive({
      status: false,
      message: ''
    });

    const userEditPayload = reactive({
      firstname: '',
      lastname: '',
      middlename: '',
      email: '',
    });

    const userOwnGroup = ref({
      label: '',
      value: ''
    });

    getUserDetail();
    getGroupList();

    function emailValidator(value) {
      return validateEmail(value)
    }
    
    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function getUserDetail () {
      if (userObj.value.firstname === undefined) {
        tableIsLoading.value = true;
      }
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get(`/api/users/${$route.params.uuid}`)
        .then((response) => {
          userObj.value = response.data;
          const editPayload = JSON.parse(JSON.stringify(response.data))
          for (const key of Object.keys(editPayload)) {
            if (Object.keys(userEditPayload).indexOf(key) >= 0) {
              userEditPayload[key] = editPayload[key];
            }
          }
          if (editPayload.groups.length > 0) {
            userOwnGroup.value.label = editPayload.groups[0].name;
            userOwnGroup.value.value = editPayload.groups[0].uuid;
          }
          tableIsLoading.value = false;
        })
        .catch((error) => {
          if (error.response.status >= 400) {
            notFound.value = true;
            tableIsLoading.value = false;
          }
      })
    }

    function getGroupList () {
      tableIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.get('/api/groups')
        .then((response) => {
          const options = [];
          for (let i = 0; i < response.data.length; i++) {
            options.push({
              label: response.data[i].name,
              value: response.data[i].uuid
            })
          }
          groupOptions.value = options;
          tableIsLoading.value = false;
      })
    }
    
    function editUser () {
      editBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.put(`/api/users/${userObj.value.uuid}`, userEditPayload)
        .then(() => {
          editBtnIsLoading.value = false;
          userEdit.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'User modified successfully'
          })
        })
        .catch((error) => {
          const errorObj = error.response;
          if (errorObj.status === 404) {
            if (errorObj.data.detail.indexOf('not found') >= 0) {
              emailError.status = true;
              emailError.message = 'email already in use!';
              editBtnIsLoading.value = false;
            }
          }
      })
    }

    function changeUserGroup () {
      editBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.post(`/api/users/${userObj.value.uuid}/groups`, { groups: [userOwnGroup.value.label] })
        .then(() => {
          getUserDetail();
          editBtnIsLoading.value = false;
          groupEdit.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'User group changed successfully'
          })
          .catch((error) => {
            const errorObj = error.response;
            console.log(error.response);
            if (errorObj.status === 404) {
              emailError.status = true;
              emailError.message = errorObj.data;
            }
            editBtnIsLoading.value = false;
          })
        })
    }
    
    return {
      userObj,
      userEdit,
      tableIsLoading,
      notFound,
      editUser,
      userEditPayload,
      emailError,
      emailValidator,
      editBtnIsLoading,
      groupEdit,
      changeUserGroup,
      groupOptions,
      userOwnGroup
    }
    
  },
})
</script>