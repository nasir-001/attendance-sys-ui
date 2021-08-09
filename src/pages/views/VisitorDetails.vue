<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-page>
      <back-button></back-button>
      <div class="q-mt-lg tw-mx-3 sm:tw-w-4/6 md:tw-w-1/2 xl:tw-w-1/3 tw-mt-5 sm:tw-mx-auto">
        <q-card class="tw-pt-5 tw-rounded-3xl tw-shadow-xl hover:tw-shadow-2xl">
          <q-card-section class="text-grey-7 tw-font-mono">
            {{ formatedDate(visitor.visit.date) }}
          </q-card-section>
          <div class="tw-flex tw-pt-5 tw-ml-8 sm:tw-ml-12 tw-justify-center">
            <div class="sm:tw--ml-2 tw-text-center tw-font-mono tw-w-20 
              tw-h-20 tw-shadow-lg md:tw-w-32 md:tw-h-32 tw-rounded-full hover:tw-shadow-md" 
              :style="{'background-color': getAvatarBackgroundColor(visitor.first_name)}">
              <p class="tw-text-2xl tw-pt-6 md:tw-pt-12 tw-text-gray-300">
                {{ visitor.first_name[0].toUpperCase() }}{{ visitor.last_name[0].toUpperCase() }}
              </p>
            </div>
            <div class="tw--ml-6">
              <div v-if="visitor.visit.status === 'admitted' " class="bg-positive tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visitor.visit.status === 'cancelled' " class="bg-negative tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visitor.visit.status === 'pending' " class="bg-warning tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
              <div v-if="visitor.visit.status === 'finished' " class="bg-primary tw-mt-16 md:tw-mt-24 tw-border-white tw-border-2 tw-w-4 tw-h-4 md:tw-h-5 md:tw-w-5 tw-rounded-full"></div>
            </div>
            <div class="tw-mt-16 md:tw-mt-24 tw-ml-2">
              <q-btn @click="showEditVisitor = true" flat dense color="primary" icon="edit" />
            </div>
          </div>
          <div>
            <div class="tw-text-center tw-text-gray-600 md:tw-pt-2 tw-text-lg md:tw-text-xl tw-font-semibold tw-uppercase">
              {{ visitor.title }}
            </div>
            <div class="tw-text-center tw-text-gray-500 tw-text-base md:tw-text-lg tw-font-semibold tw-pt-1 tw-uppercase tw-font-mono tw-tracking-wide">
              {{ visitor.first_name }} {{ visitor.last_name }}
            </div>
            <div v-if="visitor.email" class="tw-text-center tw-text-gray-400 tw-text-md tw-font-semibold tw-pt-1 tw-font-mono tw-tracking-wide">
              <q-icon name="mail" /> {{ visitor.email }} 
            </div>
            <div v-if="visitor.visit.status === 'admitted' " class="row justify-center q-mt-sm">
              <div class="text-green-7 tw-font-mono">
                <q-badge color="primary">
                  {{ visitor.visit.admitted_time }}
                </q-badge>
              </div>
            </div>
            <div v-if="visitor.visit.status === 'finished' " class="row justify-center q-mt-sm">
              <div class="text-green-7 tw-font-semibold q-mx-sm tw-font-mono">
                <q-badge color="primary">
                  {{ visitor.visit.admitted_time }}
                </q-badge>
              </div>
              <div class="text-grey-7">
                to
              </div>
              <div class="text-blue-7 tw-font-semibold q-mx-sm tw-font-mono">
                <q-badge color="primary">
                  {{ visitor.visit.depart_time }}
                </q-badge>
              </div>
            </div>
          </div>
          <div class="row tw-mb-14 justify-center tw-mt-2">
            <q-card-actions class="">
              <q-form @submit.prevent="admitVisitor">
                <q-btn 
                  v-if="visitor.visit.status === 'pending' "
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
                  v-if="visitor.visit.status === 'pending' "
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
                v-if="visitor.visit.status === 'admitted' " 
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

        <!-- Edit visitor modal/dialog -->
        <q-dialog persistent v-model="showEditVisitor">
          <q-card class="tw-w-full sm:tw-w-3/6">
            <q-card-section class="row">
              <div class="text-h6 text-primary tw--mt-1">Edit Visitor</div>
              <q-space />
              <q-btn flat v-close-popup dense round label="close" color="negative" />
            </q-card-section>
            <q-form @submit.prevent="editVisitor">
              <q-card-section class="q-pt-none">
                <q-input
                  outlined
                  auto-focus
                  lazy-rules
                  type="text"
                  v-model="visitor.title"
                  label="Title"
                  :rules="[
                    val => !!val || 'Field is required']"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input
                  outlined
                  auto-focus
                  lazy-rules
                  type="text"
                  v-model="visitor.first_name"
                  label="First Name"
                  :rules="[
                    val => !!val || 'Field is required']"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input
                  outlined
                  auto-focus
                  lazy-rules
                  type="text"
                  v-model="visitor.last_name"
                  label="Last Name"
                  :rules="[
                    val => !!val || 'Field is required']"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input
                  outlined
                  auto-focus
                  lazy-rules
                  type="text"
                  v-model="visitor.email"
                  label="Email"
                  :rules="[
                    val => !!val || 'Field is required',
                    val => emailValidator(val)
                  ]"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input
                  outlined
                  auto-focus
                  lazy-rules
                  type="number"
                  v-model="visitor.phone"
                  label="Phone"
                  :rules="[
                    val => !!val || 'Field is required',
                    val => phoneValidator(val)  
                  ]"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
              <q-select 
                outlined 
                v-model="visitor.gender"
                :options="gender" 
                label="Gender"
              />
              </q-card-section>
              <q-card-section class="q-pt-md">
                <q-select 
                  outlined 
                  v-model="visitor.visit.status" 
                  :options="options" 
                  label="Status"
                />
              </q-card-section>
              <q-card-section v-if="visitor.visit.status === 'admitted'" class="q-pt-md">
                <q-input label="Admitted time" outlined v-model="visitor.visit.admitted_time" mask="time" :rules="['time']">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time now-btn flat v-model="visitor.visit.admitted_time">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Save" color="danger" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
              <q-card-section v-if="visitor.visit.status === 'finished'" class="q-pt-md">
                <div class="tw-flex tw-justify-end tw--mb-4">
                  <q-input label="Admitted time" outlined class="tw-w-full tw-mr-1" v-model="visitor.visit.admitted_time" mask="time" :rules="['time']">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time now-btn flat v-model="visitor.visit.admitted_time">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Save" color="danger" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input label="Depart time" outlined class="tw-w-full tw-ml-1" v-model="visitor.visit.depart_time" mask="time" :rules="['time']">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time now-btn flat v-model="visitor.visit.depart_time">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Save" color="danger" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-md">
                <q-input label="Arrival Date" outlined v-model="visitor.visit.date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="visitor.visit.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Save" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  class="tw-mr-2 tw-mb-4"
                  type="submit"
                  label="Save" 
                  color="primary"
                  :disable="editBtnIsLoading"
                  :loading="editBtnIsLoading"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useAttendanceService } from '../../composables/attendanceService';
import BackButton from '../../components/BackButton.vue';
import { useRoute } from 'vue-router';
import { timeToReturn, getAvatarBackgroundColor, formatedDate, validateEmail, validatePhone } from 'boot/utils';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'visitor-details',
  components: {
    BackButton
  },

  async setup() {
    const route = useRoute();
    const data = useAttendanceService();
    const visitor = ref(null);
    const showEditVisitor = ref(false);
    const confirmDelete = ref(false);
    const editBtnIsLoading = ref(false);
    const admitBtnIsLoading = ref(false);
    const cancelBtnIsLoading = ref(false);
    const departBtnIsLoading = ref(false);
    const admitted = ref('admitted');
    const finished = ref('finished');
    const cancel = ref('cancelled');
    const $q = useQuasar();

    function emailValidator(value) {
      return validateEmail(value)
    }

    function phoneValidator(value) {
      return validatePhone(value)
    }

    const editVisitorPayload = reactive({
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: '',
      visit: {
        date: '',
        status: '',
        admitted_time: '',
        depart_time: ''
      }
    });

    function editVisitor() {
      editBtnIsLoading.value = true;
      editVisitorPayload.title = visitor.value.title,
      editVisitorPayload.first_name = visitor.value.first_name,
      editVisitorPayload.last_name = visitor.value.last_name,
      editVisitorPayload.email = visitor.value.email,
      editVisitorPayload.phone = visitor.value.phone,
      editVisitorPayload.gender = visitor.value.gender,
      editVisitorPayload.visit.date = visitor.value.visit.date,
      editVisitorPayload.visit.status = visitor.value.visit.status,
      editVisitorPayload.visit.admitted_time = visitor.value.visit.admitted_time,
      editVisitorPayload.visit.depart_time = visitor.value.visit.depart_time

      api.patch(`/api/attendance/${route.params.id}`, editVisitorPayload)
      .then(() => {
        editBtnIsLoading.value = false;
        $q.notify({
          icon: 'done',
          type: 'positive',
          timeout: 7000,
          position: 'top',
          message: 'Visitor was successfully editted'
        })
        editBtnIsLoading.value = false;
        showEditVisitor.value = false;
      })
      .catch(() => {
        $q.notify({
          icon: 'report_problem',
          type: 'negative',
          timeout: 7000,
          position: 'top',
          message: 'Failed to edit visitor'
        })
        editBtnIsLoading.value = false;
      })
    }

    function admitVisitor() {
      admitBtnIsLoading.value = true;
      const visitorAdmitPayload = reactive({
        title: visitor.value.title,
        first_name: visitor.value.first_name,
        last_name: visitor.value.last_name,
        email: visitor.value.email,
        phone: visitor.value.phone,
        gender: visitor.value.gender,
        visit: {
          date: visitor.value.visit.date,
          status: admitted.value,
          admitted_time: timeToReturn(),
          depart_time: visitor.value.visit.depart_time
        }
      })

      api.patch(`/api/attendance/${route.params.id}`, visitorAdmitPayload)
        .then(() => {
          admitBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been admitted'
          })
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
        title: visitor.value.title,
        first_name: visitor.value.first_name,
        last_name: visitor.value.last_name,
        email: visitor.value.email,
        phone: visitor.value.phone,
        gender: visitor.value.gender,
        visit: {
          date: visitor.value.visit.date,
          status: cancel.value
        }
      })

      api.patch(`/api/attendance/${route.params.id}`, visitorCancelPayload)
        .then(() => {
          cancelBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been cancelled'
          })
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
        title: visitor.value.title,
        first_name: visitor.value.first_name,
        last_name: visitor.value.last_name,
        email: visitor.value.email,
        phone: visitor.value.phone,
        gender: visitor.value.gender,
        visit: {
          date: visitor.value.visit.date,
          status: finished.value,
          admitted_time: visitor.value.visit.admitted_time,
          depart_time: timeToReturn()
        }
      })

      api.patch(`/api/attendance/${route.params.id}`, visitorLeavePayload)
        .then(() => {
          departBtnIsLoading.value = false;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor has been departed'
          })
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

    visitor.value = await data.attendance(route.params.id);

    return {
      options: [
        'pending', 'admitted', 'cancelled', 'finished'
      ],
      gender: [
        'male', 'female'
      ],
      visitor,
      getAvatarBackgroundColor,
      showEditVisitor,
      confirmDelete,
      formatedDate,
      editVisitor,
      admitVisitor,
      visitorLeave,
      cancelVisitor,
      emailValidator,
      phoneValidator,
      editBtnIsLoading,
      admitBtnIsLoading,
      cancelBtnIsLoading,
      departBtnIsLoading
     }
  }
})
</script>