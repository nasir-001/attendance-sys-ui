<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <div class="q-mt-lg tw-w-3/6 tw-mt-20 tw-mx-auto">
      <q-card class="tw-pt-5 tw-rounded-3xl tw-shadow-xl hover:tw-shadow-2xl">
        <div class="tw-flex tw-pt-5 tw-justify-center">
          <div class="tw--ml-3 sm:tw--ml-2 
            tw-text-center tw-font-mono tw-w-12 tw-h-12 tw-shadow-lg 
            md:tw-w-32 md:tw-h-32 tw-rounded-full hover:tw-shadow-md" 
            :style="{'background-color': getAvatarBackgroundColor(visitor.first_name)}">
            <p class="tw-text-2xl tw-pt-2 sm:tw-pt-12 tw-text-gray-300">
              {{ visitor.first_name[0].toUpperCase() }}{{ visitor.last_name[0].toUpperCase() }}
            </p>
          </div>
          <div class="tw--ml-6">
            <div v-if="visitor.status === 'admitted' " class="bg-positive tw-mt-24 tw-border-white tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
            <div v-if="visitor.status === 'cancel' " class="bg-negative tw-mt-24 tw-border-white tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
            <div v-if="visitor.status === 'pending' " class="bg-warning tw-mt-24 tw-border-white tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
            <div v-if="visitor.status === 'finish' " class="bg-primary tw-mt-24 tw-border-white tw-border-2 tw-h-5 tw-w-5 tw-rounded-full"></div>
          </div>
          <div class="tw-mt-24 tw-ml-2">
            <q-btn flat dense color="primary" icon="edit" />
          </div>
        </div>
        <div class="tw--ml-12">
          <div class="tw-text-center tw-text-gray-600 tw-pt-2 tw-text-xl tw-font-semibold tw-uppercase">
            {{ visitor.title }}
          </div>
          <div class="tw-text-center tw-text-gray-400 tw-text-lg tw-font-semibold tw-pt-1 tw-uppercase tw-font-mono tw-tracking-wide">
            {{ visitor.first_name }} {{ visitor.last_name }}
          </div>
          <div class="tw-text-center tw-text-gray-400 tw-text-md tw-font-semibold tw-pt-1 tw-font-mono tw-tracking-wide">
            {{ visitor.email }}
          </div>
        </div>
        <q-card-actions class="q-ma-lg tw-mb-8">
          <q-btn flat color="primary" class="q-mx-sm q-px-sm tw-w-32" dense label="admit visitor" />
          <q-btn color="negative" flat dense icon="delete" />
        </q-card-actions> 
      </q-card>      
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