<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-page padding>
      <div class="row q-pb-xl justify-center q-gutter-sm-md">
        <!-- Title -->
        <div class="col-12 col-sm-8 col-xl-6 q-mx-xl-xl">
          <back-button />
          <div class="row">
            <div class="col-12 col-sm-6 text-h5 q-pb-md q-pl-sm lt-sm">
              Add New User
            </div>
            <div class="col-12 col-sm-6 text-h4 q-pb-sm q-pl-sm gt-xs">
              Add New User
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-8 col-xl-6 q-mx-xl-xl">
          <div class="q-gutter-y-md q-gutter-sm-md q-pb-lg">
            <q-input
              outlined
              type="text"
              label="First Name"
              hide-bottom-space
              v-model="newUserPayload.firstname"
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              outlined
              type="text"
              label="Last Name"
              hide-bottom-space
              v-model="newUserPayload.lastname"
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              outlined
              type="text"
              bottom-slots
              hide-bottom-space
              label="Middle Name (Optional)"
              v-model="newUserPayload.middlename"
            />
            <q-input
              outlined
              type="email"
              label="Email"
              hide-bottom-space
              :error="emailError.status"
              @focus="emailError.status = false"
              v-model="newUserPayload.email"
              :error-message="emailError.message"
              :rules="[
                val => !!val || 'Field is required',
                val => emailValidator(val)
              ]"
            />
            <q-input
              outlined
              lazy-rules
              label="Password"
              hide-bottom-space
              v-model="newUserPayload.password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div :class="[$q.screen.lt.sm ? 'full-width' : 'float-right']">
              <q-btn
                color="primary"
                padding="sm xl"
                @click="createUser"
                label="Add new user"
                :loading="addBtnIsLoading"
                :class="[$q.screen.lt.sm ? 'full-width q-ml-sm' : '']"
                :disabled="emptyRequiredField || addBtnIsLoading"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import { validateEmail } from 'boot/utils';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import BackButton from '../../components/BackButton.vue';

export default defineComponent({
  name: 'NewUser',
  components: {
    BackButton
  },
  
  setup() {
    const isPwd = ref(true);
    const addBtnIsLoading = ref(false);
    const $q = useQuasar();
    const $router = useRouter();
    const emailError = reactive({
      status: false,
      message: ''
    });
    
    const newUserPayload = reactive({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      middlename: ''
    })

    const emptyRequiredField = computed(() => {
      return (
        !newUserPayload.firstname ||
        !newUserPayload.lastname ||
        !newUserPayload.email ||
        !newUserPayload.password
      )
    })

    function emailValidator(value) {
      return validateEmail(value)
    }

    function getAuthToken () {
      $q.localStorage.getItem('authToken')
    }

    function createUser () {
      addBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.post('/users', newUserPayload)
        .then(() => {
          addBtnIsLoading.value = true;
          // console.log($q.localStorage.getItem('authToken'));
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'User added successfully'
          })
          $router.push({ name: 'user-detail', params: { uuid: response.data.uuid } })
        })
        .catch((error) => {
          const errorObj = error.response;
          if (errorObj.status === 400) {
            if (errorObj.data.detail.indexOf('mail') >= 0) {
              emailError.status = true;
              emailError.message = errorObj.data.detail
              addBtnIsLoading.value = false;
            }
          }
        })
    }

    return {
      emailValidator,
      isPwd,
      addBtnIsLoading,
      emailError,
      newUserPayload,
      emptyRequiredField,
      createUser
    }
    
  },
})
</script>