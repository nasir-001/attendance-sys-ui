<template>
  <div class="text-red-4 tw-text-center tw-mt-24">
    <q-icon name="warning" style="font-size: 10rem;" />
    <div class="tw-text-base">Something went wrong...</div>        
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FallBack'

})
</script>