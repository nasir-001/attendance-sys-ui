<template>
  <div class="tw-mx-auto tw-mt-20 sm:tw-w-2/3 md:tw-w-2/4 lg:tw-w-2/6 xl:tw-w-1/3">
    <form>
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
          class="tw--mt-6 sm:tw--mt-0"
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
        />
      </q-card-section>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const isPwd = ref(true)
    const loginButton = ref(true)
    const credentials = reactive({
      username: '',
      password: ''
    })
    return {
      isPwd,
      loginButton,
      ...toRefs(credentials)
    }
  }

})
</script>