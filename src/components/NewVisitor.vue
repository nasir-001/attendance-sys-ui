<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideInRight">
    <p>hello</p>
  </transition>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NewVisitor'
})
</script>
