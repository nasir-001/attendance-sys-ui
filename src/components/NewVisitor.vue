<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-card flat class="q-pa-md q-mt-lg tw-w-full xl:tw-w-4/6 tw-mx-auto">
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
        <q-card-section class="q-pt-none">
          <q-select 
            outlined 
            v-model="newVisitorPayload.visit.status"
            :options="options" 
            label="Status"
          />
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <q-input label="Expected Date" outlined v-model="newVisitorPayload.visit.date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="newVisitorPayload.visit.date">
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
          v-close-popup 
        />
        </q-card-actions>
      </q-form>
    </q-card>
  </transition>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { v4 as uuidv4 }  from 'uuid';
import { useAttendanceService } from '../composables/attendanceService';

export default defineComponent({
  name: 'NewVisitor',

  setup() {
    const payloadData = useAttendanceService()
    const newVisitorPayload = reactive({
      id: uuidv4(),
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: '',
      visit: {
        date: '',
        status: ''
      }
    })

    const newVisitorData = () => {
      return payloadData.newVisitor(newVisitorPayload)
    }

    return {
      options: [
        'pending', 'admitted', 'cancelled', 'finished'
      ],
      gender: [
        'male', 'female'
      ],
      newVisitorPayload,
      newVisitorData
    }
  }
})
</script>
