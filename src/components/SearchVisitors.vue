<template>
  <transition 
    appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideInRight"
  >
    <div>
      Search Visitor
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchVisitors'
})
</script>