<template>
  <div class="row jutify-center text-center" style="padding-top: 25vh;">
    <div class="col-12 q-px-md">
      <div class="text-h1 q-pb-lg">404</div>
      <p class="text-subtitle">We can't seem to find the page you're looking for.</p>
      <div v-if="back" class="q-gutter-md">
        <q-btn
          unelevated
          color="primary"
          label="Go Back"
          class="q-px-md"
          @click="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NotFound404',

  props: {
    back: {
      type: Boolean,
      default: false
    }
  },
  
  setup() {
    const $router = useRouter()

    function goBack () {
      return $router.back()
    }

    return {
      goBack,
      ...toRefs(props)
    }
  }
})
</script>