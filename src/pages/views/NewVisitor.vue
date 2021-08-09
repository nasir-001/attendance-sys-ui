<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <q-page>
      <back-button></back-button>
      <div v-if="showForm" class="q-pa-md q-mb-xl q-mt-lg tw-mx-2 sm:tw-w-4/6 md:tw-w-1/2 sm:tw-mx-auto tw-shadow-xl tw-rounded-3xl hover:tw-shadow-2xl">
        <q-form @submit.prevent="newVisitor">
          <q-card-section class="q-pt-none">
            <q-input
              hide-bottom-space
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
              hide-bottom-space
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
              hide-bottom-space
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
              hide-bottom-space
              outlined
              auto-focus
              lazy-rules
              type="text"
              v-model="newVisitorPayload.email"
              label="Email"
              :rules="[
                val => !!val || 'Field is required',
                val => emailValidator(val)
              ]"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              hide-bottom-space
              outlined
              auto-focus
              lazy-rules
              type="number"
              v-model="newVisitorPayload.phone"
              mask="phone"
              label="Phone"
              maxlength="11"
              :rules="[
                val => !!val || 'Field is required',
                val => phoneValidator(val)
              ]"
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-select 
              outlined
              v-model="newVisitorPayload.gender"
              :options="gender" 
              label="Gender"
              :rules="[
                val => !!val || 'Field is required'
              ]"
            />
          </q-card-section>
          <q-card-section class="tw--mt-8">
            <q-input
              hide-bottom-space 
              label="Arrival Date" 
              outlined 
              v-model="newVisitorPayload.visit.date"
              :rules="[
                val => !!val || 'Field is required'
              ]"
            >
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
            :loading="addBtnIsLoading"
            :disable="emptyRequiredField || addBtnIsLoading"
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
import { defineComponent, reactive, ref, computed } from 'vue';
import { useAttendanceService } from '../../composables/attendanceService';
import BackButton from '../../components/BackButton.vue';
import { validateEmail, validatePhone } from 'boot/utils';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'NewVisitor',
  components: {
    BackButton
  },

  async setup() {
    const showForm = ref(false);
    const addBtnIsLoading = ref(false);
    const $q = useQuasar();
    
    const newVisitorPayload = reactive({
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: '',
      visit: {
        date: ''
      }
    })

    const emptyRequiredField = computed(() => {
      return (
        !newVisitorPayload.title ||
        !newVisitorPayload.first_name ||
        !newVisitorPayload.last_name ||
        !newVisitorPayload.email ||
        !newVisitorPayload.phone ||
        !newVisitorPayload.gender ||
        !newVisitorPayload.visit.date
      )
    })

    function newVisitor () {
      addBtnIsLoading.value = true;
      // api.defaults.headers.common = {
      //   Authorization: `Bearer ${getAuthToken()}`
      // }
      api.post('/api/attendance/', newVisitorPayload)
        .then(() => {
          addBtnIsLoading.value = true;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor was successfully added'
          })
          // $router.push({ name: 'admin-visitor-details', params: { uuid: response.data.id } })
        })
        .catch((error) => {
          addBtnIsLoading.value = false;
          $q.notify({
            icon: 'report_problem',
            type: 'negative',
            timeout: 7000,
            position: 'top',
            message: 'Failed to add visitor'
          })          
        })
    }

    function phoneValidator(value) {
      return validatePhone(value)
    }

    function emailValidator(value) {
      return validateEmail(value)
    }
    

    setTimeout(() => {
      showForm.value = !showForm.value;
    }, 500);

    return {
      gender: [
        'male', 'female'
      ],
      newVisitorPayload,
      newVisitor,
      showForm,
      emailValidator,
      addBtnIsLoading,
      phoneValidator,
      emptyRequiredField
    }
  }
})
</script>
