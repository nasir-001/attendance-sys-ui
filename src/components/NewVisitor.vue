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
            v-model="newVisitoPayload.title"
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
            v-model="newVisitoPayload.first_name"
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
            v-model="newVisitoPayload.last_name"
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
            v-model="newVisitoPayload.email"
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
            v-model="newVisitoPayload.phone"
            label="Phone"
            :rules="[
              val => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select 
            outlined 
            v-model="newVisitoPayload.gender"
            :options="gender" 
            label="Gender"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select 
            outlined 
            v-model="newVisitoPayload.visit.status"
            :options="options" 
            label="Status"
          />
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <q-input label="Expected Date" outlined v-model="newVisitoPayload.visit.date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="newVisitoPayload.visit.date">
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
          flat 
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
    const newVisitoPayload = reactive({
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

    const newVisitorData = (payload) => {
      payload = payloadData.newVisitor(newVisitoPayload)
    }

    return {
      options: [
        'pending', 'admitted', 'cancelled', 'finished'
      ],
      gender: [
        'male', 'female'
      ],
      newVisitoPayload,
      newVisitorData
    }
  }
})
</script>
