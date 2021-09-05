<template>
  <q-btn
    flat
    padding="sm"
    color="primary"
    class="q-my-sm"
    @click="goBack"
  >
    <q-icon
      left name="arrow_back"
      class="q-mr-xs"
    />
    <div>Back</div>
  </q-btn>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'BackButton',

  setup() {
    const $router = useRouter();
    function goBack() {
      return $router.back()
    }

    return { goBack }
  }
})
</script>