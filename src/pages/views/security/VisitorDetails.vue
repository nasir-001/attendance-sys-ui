<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight">
    <q-page>
      <div class="q-mt-lg tw-mx-3 sm:tw-w-4/6 md:tw-w-1/2 xl:tw-w-1/3 tw-mt-5 sm:tw-mx-auto">
      <back-button />
        <!-- visitor detail -->
        <q-card class="tw-pt-5 tw-rounded-3xl tw-shadow-xl hover:tw-shadow-2xl">
          <q-card-section class="text-grey-7 tw-font-mono">
            {{ formatedDate(visit.date) }}
          </q-card-section>
          <div class="tw-flex tw-pt-5 tw-justify-center">
            <div class="tw-text-center tw-font-mono tw-w-20 
              tw-h-20 tw-shadow-lg md:tw-w-32 md:tw-h-32 tw-rounded-full hover:tw-shadow-md" 
              :style="{'background-color': getAvatarBackgroundColor(visit.visitor.first_name)}">
              <p class="tw-text-2xl tw-pt-6 md:tw-pt-12 tw-text-gray-300">
                {{ visit.visitor.first_name[0].toUpperCase() }}{{ visit.visitor.last_name[0].toUpperCase() }}
              </p>
            </div>
            <div class="tw--ml-6">
              <div v-if="visit.status === 'admitted' " class="bg-positive tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visit.status === 'cancelled' " class="bg-negative tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visit.status === 'pending' " class="bg-warning tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visit.status === 'finished' " class="bg-primary tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
            </div>
          </div>
          <div>
            <div class="tw-text-center tw-text-gray-600 md:tw-pt-2 tw-text-lg md:tw-text-xl tw-font-semibold tw-uppercase">
              {{ visit.visitor.title }}
            </div>
            <div class="tw-text-center tw-text-gray-500 tw-text-base md:tw-text-lg tw-font-semibold tw-pt-1 tw-uppercase tw-font-mono tw-tracking-wide">
              {{ visit.visitor.first_name }} {{ visit.visitor.last_name }}
            </div>
            <div v-if="visit.status === 'admitted' " class="row justify-center q-mt-sm">
              <div class="text-green-7 tw-font-mono">
                <q-badge color="primary">
                  {{ formattedTime(visit.admitted_time) }}
                </q-badge>
              </div>
            </div>
            <div v-if="visit.status === 'finished' " class="row justify-center q-mt-sm">
              <div class="text-green-7 tw-font-semibold q-mx-sm tw-font-mono">
                <q-badge color="primary">
                  {{ formattedTime(visit.admitted_time) }}
                </q-badge>
              </div>
              <div class="text-grey-7">
                to
              </div>
              <div class="text-blue-7 tw-font-semibold q-mx-sm tw-font-mono">
                <q-badge color="primary">
                  {{ formattedTime(visit.depert_time) }}
                </q-badge>
              </div>
            </div>
          </div>
          <div class="row tw-mb-14 justify-center tw-mt-2">
            <q-card-actions class="">
              <q-form @submit.prevent="admitVisitor">
                <q-btn 
                  v-if="visit.status === 'pending' "
                  type="submit"
                  color="primary" 
                  class="q-mx-sm tw-w-32 tw-font-semibold" 
                  dense 
                  label="admit visitor"
                  :disable="admitBtnIsLoading"
                  :loading="admitBtnIsLoading"
                />
              </q-form>
            </q-card-actions> 
            <q-card-actions class="">
              <q-form @submit.prevent="cancelVisitor">
                <q-btn 
                  v-if="visit.status === 'pending' "
                  type="submit"
                  color="negative" 
                  class="q-mx-sm tw-w-32 tw-font-semibold" 
                  dense 
                  label="cancel visitor"
                  :disable="cancelBtnIsLoading" 
                  :loading="cancelBtnIsLoading"
                />
              </q-form>
            </q-card-actions> 
          </div>
          <q-card-actions class="tw--mt-20 tw-pb-8">
            <q-form class="tw-mx-auto" @submit.prevent="visitorLeave">
              <q-btn 
                v-if="visit.status === 'admitted' " 
                type="submit"
                color="primary" 
                class="q-mx-sm tw-w-42 tw-font-semibold tw-mx-4" 
                dense 
                label="visitor departed" 
                :loading="departBtnIsLoading"
                :disable="departBtnIsLoading"
              />
            </q-form>
          </q-card-actions>
        </q-card>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useAttendanceService } from '../../../composables/attendanceService';
import BackButton from '../../../components/BackButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { timeToReturn, getAvatarBackgroundColor, formatedDate, formattedTime, validateEmail, validatePhone } from 'boot/utils';
import { api } from 'boot/axios';
import { getMetaData } from 'boot/utils';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'visitor-details',
  mixins: [getMetaData('Visitor')],
  components: {
    BackButton
  },

  async setup() {
    const route = useRoute();
    const data = useAttendanceService();
    const visit = ref(null);
    const confirmDelete = ref(false);
    const editBtnIsLoading = ref(false);
    const admitBtnIsLoading = ref(false);
    const cancelBtnIsLoading = ref(false);
    const departBtnIsLoading = ref(false);
    const admitted = ref('admitted');
    const finished = ref('finished');
    const cancel = ref('cancelled');
    const $q = useQuasar();
    const $router = useRouter()

    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function phoneValidator(value) {
      return validatePhone(value)
    }

    function admitVisitor() {
      admitBtnIsLoading.value = true;
      const visitorAdmitPayload = reactive({
        status: admitted.value,
        admitted_time: timeToReturn(),
      })

      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.put(`/visit/${route.params.id}`, visitorAdmitPayload)
        .then(() => {
          admitBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been admitted'
          })
          $router.push({ name: 'admin-visitors-list' })
        })
        .catch(() => {
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 7000,
            position: 'top',
            message: 'Failed to admit visitor'
          })
          admitBtnIsLoading.value = false;
        })
    };

    function cancelVisitor() {
      cancelBtnIsLoading.value = true;
      const visitorCancelPayload = reactive({
        date: visit.value.date,
        status: cancel.value
      })

      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.put(`/visit/${route.params.id}`, visitorCancelPayload)
        .then(() => {
          cancelBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been cancelled'
          })
          $router.push({ name: 'admin-visitors-list' })
        })
        .catch(() => {
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 7000,
            position: 'top',
            message: 'Failed to cancel visitor'
          })
          cancelBtnIsLoading.value = false;
        })
    };

    function visitorLeave() {
      departBtnIsLoading.value = true;
      const visitorLeavePayload = reactive({
        status: finished.value,
        depert_time: timeToReturn(),
      })

      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.put(`/visit/${route.params.id}`, visitorLeavePayload)
        .then(() => {
          departBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been departed'
          })
          $router.push({ name: 'admin-visitors-list' })
        })
        .catch(() => {
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 7000,
            position: 'top',
            message: 'Failed to depart visitor'
          })
          departBtnIsLoading.value = false;
        })
    };

    visit.value = await data.attendance(route.params.id);

    return {
      options: [
        'pending', 'admitted', 'cancelled', 'finished'
      ],
      visit,
      getAvatarBackgroundColor,
      confirmDelete,
      formatedDate,
      admitVisitor,
      visitorLeave,
      cancelVisitor,
      phoneValidator,
      editBtnIsLoading,
      admitBtnIsLoading,
      cancelBtnIsLoading,
      departBtnIsLoading,
      formattedTime
     }
  }
})
</script>