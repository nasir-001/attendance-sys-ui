<template>
  <transition 
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
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