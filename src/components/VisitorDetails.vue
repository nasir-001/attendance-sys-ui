<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideInRight">
    <p>{{visitor.title}}</p>
  </transition>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useAttendanceService } from '../composables/attendanceService';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'visitor-details',

  async setup() {
    const route = useRoute()
    const data = useAttendanceService()
    const visitor = ref(null)

    visitor.value = await data.attendance(route.params.id)
    return { visitor }
  }
})
</script>