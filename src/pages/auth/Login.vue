<template>
  <transition appear
    enter-active-class="animated slideInDown">
    <div class="q-pa-sm row justify-center">
      <div class="col-12 col-sm-7 col-md-4 col-xl-3 tw-rounded-lg tw-border-2 tw-text-gray-400 tw-mt-20">
        <q-card flat class="q-pb-sm w100">
          <form @submit.prevent="loginUser()">
            <q-card-section class="text-center q-my-md">
              <div class="text-h5">Login your account.</div>
            </q-card-section>
            <q-card-section>
              <q-input
                outlined
                hide-bottom-space
                auto-focus
                lazy-rules
                type="email"
                label="email"
                v-model="email"
                :rules="[
                  val => !!val || 'Field is required',
                  val => emailValidator(val)
                ]"
              />
            </q-card-section>
            <q-card-section class="tw--mt-2">
              <q-input
                class="sm:tw--mt-0 tw-overflow-hidden"
                outlined
                hide-bottom-space
                lazy-rules
                label="Password"
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                :rules="[val => !!val || 'Field is required']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer tw-text-gray-400"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="tw-mb-6">
              <q-btn
                label="Login"
                type="submit"
                color="primary"
                :disabled="emptyRequiredField || loginBtnIsLoading"
                class="full-width tw-text-base sm:tw-text-lg tw-rounded-full sm:tw-rounded-lg tw--mt-6 sm:tw--mt-0"
              />
            </q-card-section>
          </form>
        </q-card>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { validateEmail, hasPermission, getMetaData } from 'boot/utils';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  mixins: [getMetaData('Login')],
  
  setup() {
    const $q = useQuasar()
    const isPwd = ref(true);
    const loginBtnIsLoading = ref(false);
    const email = ref('');
    const password = ref('');
    const $router = useRouter()

    function emailValidator(value) {
      return validateEmail(value)
    }

    const emptyRequiredField = computed(() => {
      return (
        !email.value ||
        !password.value 
      )
    })

    const loginUser = () => {
      loginBtnIsLoading.value = true;
      api.post(`/auth/token?email=${ email.value }&password=${ password.value }`)
        .then((response) => {
          if (response.status === 200) {
            $q.localStorage.set('authToken', response.data.access_token)
            loginBtnIsLoading.value = false;
            if (hasPermission(response.data.access_token, 'can_view_super_admin_dashboard')) {
              $router.push({ name: 'admin-visitors-list' })
            } else {
              $router.push({ name: 'visitors-list' })
            }
          }
        })
        .catch((error) => {
          loginBtnIsLoading.value = false;
          if (!error.response) {
            $q.notify({
              type: 'negative',
              icon: 'mdi-network-strength-3-alert',
              timeout: 8000,
              position: 'top',
              message: 'Network error!',
            })
          } else if (error.response.data.detail) {
            $q.notify({
              type: 'negative',
              icon: 'mdi-network-strength-3-alert',
              timeout: 8000,
              position: 'top',
              message: error.response.data.detail,
            })
            loginBtnIsLoading.value = false;
          }
        })
    }

    return {
      isPwd,
      loginBtnIsLoading,
      password,
      email,
      loginUser,
      emptyRequiredField,
      emailValidator
    }
  }

})
</script>