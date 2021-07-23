<template>
  <div class="q-pa-sm row justify-center">
    <div class="col-12 col-sm-7 col-md-4 col-xl-3 tw-rounded-lg tw-border-2 tw-text-gray-400 tw-mt-20">
      <q-card flat class="q-pb-sm w100">
        <form>
          <q-card-section class="text-center q-my-md">
            <div class="text-h5">Login your account.</div>
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              auto-focus
              lazy-rules
              type="text"
              label="Username"
              v-model="username"
              :rules="[
                val => !!val || 'Field is required']"
            />
          </q-card-section>
          <q-card-section class="tw--mt-2">
            <q-input
              class="sm:tw--mt-0 tw-overflow-hidden"
              outlined
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
          <q-card-section class="tw--mt-2 tw-mb-6">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width tw-text-base sm:tw-text-lg tw-rounded-full sm:tw-rounded-lg tw--mt-6 sm:tw--mt-0"
              @click="loadData()"            
              :disable="disableState"
              :loading="loadingState"
            />
          </q-card-section>
        </form>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'Login',
  setup() {
    const $q = useQuasar()
    const isPwd = ref(true);
    const loginButton = ref(true);
    const credentials = reactive({
      username: '',
      password: ''
    });

    const buttonState = reactive({
      loadingState: false,
      disableState: false
    })

    const loadData = () => {
      api.post(`/`)
        .then((response) => {
          console.log(response.data)
          $router.push('/dashboard')
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading Failed',
            icon: 'report_problem'
          })
        })
    }

    return {
      isPwd,
      loginButton,
      ...toRefs(credentials),
      ...toRefs(buttonState),
      loadData
    }
  }

})
</script>