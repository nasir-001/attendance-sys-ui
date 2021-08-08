<template>
  <q-page padding>
    <div class="row q-pb-xl justify-center q-gutter-sm-md">
      <!-- Title -->
      <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl">
        <back-button />
        <div class="row">
          <div class="col-12 col-sm-6 text-h5 q-pb-md q-pl-sm lt-sm">
            <!-- {{ userObj.firstname }} -->
          </div>
          <div class="col-12 col-sm-6 text-h4 q-pb-md q-pl-sm gt-xs">
            <!-- {{ userObj.firstname }} -->
          </div>
        <div class="col-12 col-sm-6 q-gutter-sm">
          <q-btn
            no-caps
            color="primary"
            label="Edit User Info"
            @click="userEdit = true"
            :class="[$q.screen.lt.sm ? 'q-mt-sm' : 'float-right']"
          />
          <q-btn
            no-caps
            outline
            color="primary"
            label="Change User Group"
            @click="groupEdit = true"
            :class="[$q.screen.lt.sm ? 'q-mt-sm' : 'float-right']"
          />
        </div>
        </div>
      </div>

      <!-- Not Found -->
      <!-- <not-found v-if="notFound" back /> -->

      <!-- Found -->
      <div class="col-12 col-sm-10 col-lg-8 col-xl-6 q-mx-xl-xl">
        <!-- Loading Skeleton -->
        <div class="row justify-center q-pb-xl">
          <div class="col-12 q-gutter-sm q-pt-lg">
            <q-skeleton animation="pulse" type="QInput" />
            <q-skeleton animation="pulse" type="QInput" />
            <q-skeleton animation="pulse" type="QInput" />
            <q-skeleton animation="pulse" type="QInput" />
          </div>
        </div>

        <!-- User Detail -->
        <div class="row">
          <div class="col-12">
            <q-input
              readonly
              outlined
              type="text"
              label="First Name"
            />
            <q-input
              readonly
              outlined
              type="text"
              label="Last Name"
            />
            <q-input
              readonly
              outlined
              type="text"
              label="Middle Name"
            />
            <q-input
              readonly
              outlined
              type="text"
              label="Email"
            />
            <q-input
              readonly
              outlined
              type="text"
              label="User Group"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit user modal/dialog -->
    <q-dialog no-backdrop-dismiss>
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="text-center">
          <div class="text-h5">Edit User</div>
          <div class="text-subtitle2">Edit user information</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <form class="q-gutter-md q-py-md">
              <q-input
                outlined
                type="text"
                label="First Name"
                :rules="[val => !!val || 'Field is required']"
              />
              <q-input
                outlined
                type="text"
                label="Last Name"
                :rules="[val => !!val || 'Field is required']"
              />
              <q-input
                outlined
                type="text"
                bottom-slots
                label="Middle Name (Optional)"
              />
              <q-input
                outlined
                type="email"
                label="Email"
                :rules="[
                  val => !!val || 'Field is required',
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
                />
              </q-card-actions>
            </form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Change user group modal/dialog -->
    <q-dialog no-backdrop-dismiss>
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="text-center">
          <div class="text-h5">Change User Group</div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <form class="q-gutter-md q-py-md">
              <q-select
                outlined
                label="User Group"
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
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import BackButton from '../../components/BackButton.vue';
import { validateEmail } from 'boot/utils';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'UserDetail',
  components: {
    BackButton
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
    const userOwnGroup = reactive({
      label: '',
      value: ''
    });
    getUserDetail();
    getGroupList();

    function emailValidator(value) {
      return validateEmail(value)
    }
    
    function getAuthToken () {
      $q.localStorage.getItem('authToken')
    }

    function getUserDetail () {
      if (userObj.value.firstname === undefined) {
        tableIsLoading.value = true;
      }
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.get(`/api/users/${$route.params.uuid}`)
        .then((response) => {
          userObj.value = response.data;
          const editPayload = JSON.parse(JSON.stringify(response.data))
          for (const key of Object.keys(editPayload)) {
            if (Object.keys(userEditPayload).indexOf(key) >= 0) {
              userEditPayload[key] = editPayload[key];
            }
          }
          if (editPayload.groups.lenlength > 0) {
            userOwnGroup = {
              label: editPayload.groups[0].name,
              value: editPayload.groups[0].uuid
            }
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
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.get('/api/groups')
        .then((response) => {
          const options = ref([]);
          for (let i = 0; i < response.data.length; i++) {
            options.value.push({
              label: response.data[i].name,
              value: response.data[i].uuid
            })
          }
          groupOptions.value = options.value;
          tableIsLoading.value = false;
      })
    }
    function editUser () {
      editBtnIsLoading.value = true;
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.put(`/api/users/${userObj.value.uuid}`, userEditPayload)
        .then((response) => {
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
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.put(`/api/users/${userObj.value.uuid}/groups`, { groups: [userOwnGroup.value.label] })
        .then((response) => {
          getUserDetail()
          editBtnIsLoading.value = false;
          groupEdit.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 5000,
            position: 'top',
            message: 'User group changed successfully'
          })
        })
        .catch((error) => {
          const errorObj = error.response;
          if (errorObj.status === 404) {
            emailError.status = true;
            emailError.message = errorObj.data;
          }
          editBtnIsLoading.value = false;
        })
    }
    
  },
})
</script>