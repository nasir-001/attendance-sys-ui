<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-page>
      <back-button></back-button>
      <div v-if="showForm" class="q-pa-md q-mb-xl q-mt-lg tw-mx-2 sm:tw-w-4/6 md:tw-w-1/2 sm:tw-mx-auto tw-shadow-xl tw-rounded-3xl hover:tw-shadow-2xl">
        <q-form @submit.prevent="newVisitorData">
          <q-card-section class="q-pt-none">
            <q-input
              outlined
              auto-focus
              lazy-rules
              type="text"
              v-model="newVisitorPayload.title"
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
              v-model="newVisitorPayload.first_name"
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
              v-model="newVisitorPayload.last_name"
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
              v-model="newVisitorPayload.email"
              label="Email"
              :rules="[
                val => !!val || 'Field is required']"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              outlined
              auto-focus
              lazy-rules
              type="number"
              v-model="newVisitorPayload.phone"
              label="Phone"
              :rules="[
                val => !!val || 'Field is required']"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select 
              outlined 
              v-model="newVisitorPayload.gender"
              :options="gender" 
              label="Gender"
            />
          </q-card-section>
          <q-card-section class="q-pt-md">
            <q-select 
              outlined 
              v-model="newVisitorPayload.visit.status"
              :options="options" 
              label="Status"
            />
          </q-card-section>
          <q-card-section v-if="newVisitorPayload.visit.status === 'admitted'" class="q-pt-md">
            <q-input label="Admitted time" filled v-model="newVisitorPayload.visit.admitted_time" mask="time" :rules="['time']">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time now-btn v-model="newVisitorPayload.visit.admitted_time">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Save" color="danger" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section v-if="newVisitorPayload.visit.status === 'finished'" class="q-pt-md">
            <div class="tw-flex tw-justify-end tw--mb-4">
              <q-input label="Admitted time" class="tw-w-full tw-mr-1" filled v-model="newVisitorPayload.visit.admitted_time" mask="time" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time now-btn v-model="newVisitorPayload.visit.admitted_time">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Save" color="danger" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input label="Depart time" class="tw-w-full tw-ml-1" filled v-model="newVisitorPayload.visit.depart_time" mask="time" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time now-btn v-model="newVisitorPayload.visit.depart_time">
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
            <q-input label="Arrival Date" outlined v-model="newVisitorPayload.visit.date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date 
                      today-btn 
                      v-model="newVisitorPayload.visit.date"
                    >
                      <div class="row items-center justify-end">
                        <q-btn 
                          v-close-popup 
                          label="Save" 
                          color="primary" flat
                        />
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
            label="Submit" 
            color="primary" 
            v-close-popup 
          />
          </q-card-actions>
        </q-form>
      </div>
      <div v-else class="q-pa-md q-mb-xl tw-mt-4 tw-mx-2 sm:tw-w-4/6 md:tw-w-1/2 sm:tw-mx-auto tw-shadow-xl tw-rounded-3xl hover:tw-shadow-2xl">
        <q-skeleton v-for="n in 7" :key="n" class="q-ma-xl" type="QInput" height="50px" />
      </div>
    </q-page>
  </transition>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { v4 as uuidv4 }  from 'uuid';
import { useAttendanceService } from '../../composables/attendanceService';
import BackButton from '../../components/BackButton.vue';

export default defineComponent({
  name: 'NewVisitor',
  components: {
    BackButton
  },

  setup() {
    const payloadData = useAttendanceService()
    const showForm = ref(false)
    const newVisitorPayload = reactive({
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
    })

    const newVisitorData = () => {
      return payloadData.newVisitor(newVisitorPayload)
    }

    setTimeout(() => {
      showForm.value = !showForm.value
    }, 500)

    return {
      options: [
        'pending', 'admitted', 'cancelled', 'finished'
      ],
      gender: [
        'male', 'female'
      ],
      newVisitorPayload,
      newVisitorData,
      showForm
    }
  }
})
</script>
