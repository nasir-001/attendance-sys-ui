<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <p>hello</p>
  </transition>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NewVisitor'
})
</script>
