<template>
  <div class="tw-mx-2">
    <div class="tw-mx-auto tw-rounded-lg tw-border-2 tw-border-gray-200 tw-mt-20 sm:tw-w-2/3 md:tw-w-2/4 lg:tw-w-2/6 xl:tw-w-1/3">
      <form class="tw-my-10 tw-mx-2">
        <q-card-section class="text-center">
          <div class="tw-text-lg sm:tw-text-xl md:tw-text-2xl tw-text-gray-500 tw-font-mono">Login your account.</div>
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
        <q-card-section>
          <q-input
            class="tw--mt-6 sm:tw--mt-0 tw-overflow-hidden"
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
                class="cursor-pointer text-primary"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
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
          $router.push({ name: 'dashboard' })
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