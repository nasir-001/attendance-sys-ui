<template>
  <transition appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft">
    <q-page class="q-pa-md q-mb-xl q-mt-lg tw-mx-2 sm:tw-w-4/6 md:tw-w-1/2 sm:tw-mx-auto ">
      <back-button />
      <div v-if="showForm" class="tw-shadow-xl tw-rounded-3xl hover:tw-shadow-2xl">
        <q-form @submit.prevent="newVisitor">
          <q-card-section class="q-pt-none">
            <q-input
              hide-bottom-space
              outlined
              auto-focus
              lazy-rules
              type="text"
              v-model="newVisitorPayload.visitor.title"
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
              v-model="newVisitorPayload.visitor.first_name"
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
              v-model="newVisitorPayload.visitor.last_name"
              label="Last Name"
              :rules="[
                val => !!val || 'Field is required']"
            />
          </q-card-section>
          <q-card-section class="tw--mt-4">
            <q-input
              hide-bottom-space 
              label="Arrival Date" 
              outlined 
              v-model="newVisitorPayload.date"
              :rules="[
                val => !!val || 'Field is required'
              ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      mask="YYYY-MM-DD" 
                      today-btn
                      v-model="newVisitorPayload.date"
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
import BackButton from '../../../components/BackButton.vue';
import { validateEmail, validatePhone } from 'boot/utils';
import { api } from 'boot/axios';
import { getMetaData } from 'boot/utils';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NewVisitor',
  mixins: [getMetaData('Create Visitor')],
  components: {
    BackButton
  },

  async setup() {
    const showForm = ref(false);
    const addBtnIsLoading = ref(false);
    const $q = useQuasar();
    const $router = useRouter();
    
    const newVisitorPayload = reactive({
      date: '',
      visitor: {
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
      }
    })

    const sex = [
      {
        label: 'male',
        value: 'm'
      },
      {
        label: 'female',
        value: 'f'
      }
    ]

    const emptyRequiredField = computed(() => {
      return (
        !newVisitorPayload.visitor.title ||
        !newVisitorPayload.visitor.first_name ||
        !newVisitorPayload.visitor.last_name ||
        !newVisitorPayload.date
      )
    })

    function getAuthToken () {
      return $q.localStorage.getItem('authToken')
    }

    function newVisitor () {
      addBtnIsLoading.value = true;
      api.defaults.headers.common = {
        Authorization: `Bearer ${getAuthToken()}`
      }
      api.post('/visit/create/', newVisitorPayload)
        .then((response) => {
          addBtnIsLoading.value = true;
          $q.notify({
            icon: 'done',
            type: 'positive',
            timeout: 7000,
            position: 'top',
            message: 'Visitor was successfully added'
          })
          $router.push({ name: 'admin-visitor-details', params: { id: response.data.uuid } })
        })
        .catch((error) => {
          console.log(error);
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

    setTimeout(() => {
      showForm.value = !showForm.value;
    }, 500);

    return {
      sex,
      newVisitorPayload,
      newVisitor,
      showForm,
      addBtnIsLoading,
      phoneValidator,
      emptyRequiredField
    }
  }
})
</script>
