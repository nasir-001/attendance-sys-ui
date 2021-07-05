<template>
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
    <q-card-section>
      <q-input
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
            class="cursor-pointer"
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
        class="full-width"
      />
    </q-card-section>
  </form>
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