<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <div class="q-pa-md q-mt-lg tw-mx-auto tw-w-1/4">
      <div class="tw--ml-3 sm:tw--ml-2 
        tw-text-center tw-font-mono tw-w-12 tw-h-12 tw-shadow-lg 
        md:tw-w-32 md:tw-h-32 tw-rounded-full hover:tw-shadow-md" 
        :style="{'background-color': getAvatarBackgroundColor(visitor.first_name)}">
        <p class="tw-text-2xl tw-pt-2 sm:tw-pt-12 tw-text-gray-300">
          {{ visitor.first_name[0].toUpperCase() }}{{ visitor.last_name[0].toUpperCase() }}
        </p>
      </div>
      <div v-if="visitor.status === 'admitted'" class="bg-positive tw--mt-7 tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
      <div v-if="visitor.status === 'cancel'" class="bg-negative tw--mt-7 tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
      <div v-if="visitor.status === 'pending'" class="bg-warning tw--mt-7 tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
      <div v-if="visitor.status === 'finish'" class="bg-primary tw--mt-7 tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
    </div>
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

    const colors = [
      '#1abc9c',
      '#2ecc71',
      '#3498db',
      '#3498db',
      '#9b59b6',
      '#34495e',
      '#16a085',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
      '#2c3e50',
    ];

    function getAvatarBackgroundColor(username) {
      const index = username.length % colors.length;
      return colors[index];
    }

    visitor.value = await data.attendance(route.params.id)
    return { 
      visitor,
      getAvatarBackgroundColor
     }
  }
})
</script>