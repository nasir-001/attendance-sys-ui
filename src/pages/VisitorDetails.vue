<template>
  <transition appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight">
    <div class="q-mt-lg tw-mx-3 sm:tw-w-4/6 md:tw-w-1/2 xl:tw-w-1/3 tw-mt-20 sm:tw-mx-auto">
      <q-card class="tw-pt-5 tw-rounded-3xl tw-shadow-xl hover:tw-shadow-2xl">
        <q-card-section class="text-grey-7 tw-font-mono">{{ formatedDate(visitor.visit.date) }}</q-card-section>
        <div class="tw-flex tw-pt-5 tw-justify-center">
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
            <q-btn @click="showAddVisitor = true" flat dense color="primary" icon="edit" />
          </div>
        </div>
        <div class="tw--ml-8 md:tw--ml-10">
          <div class="tw-text-center tw-text-gray-600 md:tw-pt-2 tw-text-lg md:tw-text-xl tw-font-semibold tw-uppercase">
            {{ visitor.title }}
          </div>
          <div class="tw-text-center tw-text-gray-500 tw-text-base md:tw-text-lg tw-font-semibold tw-pt-1 tw-uppercase tw-font-mono tw-tracking-wide">
            {{ visitor.first_name }} {{ visitor.last_name }}
          </div>
          <div v-if="visitor.email" class="tw-text-center tw-text-gray-400 tw-text-md tw-font-semibold tw-pt-1 tw-font-mono tw-tracking-wide">
            <q-icon name="mail" /> {{ visitor.email }} 
          </div>
        </div>
        <q-card-actions class="tw-pt-5 md:tw-pt-8 tw-pb-5">
          <q-form @submit.prevent="admitVisitor">
            <q-btn 
              v-if="visitor.visit.status === 'pending' "
              flat 
              type="submit"
              color="primary" 
              class="q-mx-sm q-px-sm tw-w-32" 
              dense 
              label="admit visitor" 
            />
          </q-form>
          <q-form>
            <q-btn 
              v-if="visitor.visit.status === 'admitted' "
              flat 
              type="submit"
              color="positive" 
              class="q-mx-sm q-px-sm tw-w-32" 
              dense 
              label="visitor leave" 
            />
          </q-form>
          <q-btn 
            @click="confirmDelete = true" 
            color="negative" 
            flat 
            dense  
            label="delete"
          />
        </q-card-actions> 
      </q-card>

      <q-dialog v-model="showAddVisitor">
        <q-card class="tw-w-full sm:tw-w-3/6">
          <q-card-section class="row">
            <div class="text-h6 text-primary tw--mt-1">Edit Visitor</div>
            <q-space />
            <q-btn flat v-close-popup dense round icon="close" />
          </q-card-section>
          <q-form @submit="editVisitor">
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
                  val => !!val || 'Field is required']"
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
                  val => !!val || 'Field is required']"
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
            <q-card-section class="q-pt-none">
              <q-select 
                outlined 
                v-model="visitor.visit.status" 
                :options="options" 
                label="Status"
              />
            </q-card-section>
            <q-card-section class="q-pt-lg">
              <q-input label="Expected Date" outlined v-model="visitor.visit.date">
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
                v-close-popup 
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirmDelete">
        <q-card class="sm:tw-w-2/6">
          <q-card-section class="row">
            <div class="text-h6 tw-text-gray-800 tw--mt-1">Attention</div>
            <q-space />
            <q-btn flat v-close-popup dense round icon="close" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="tw-text-lg tw-text-gray-600">Are you sure you want to delete this visitor?</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              class="tw-mr-2 tw-mb-4"
              type="submit"
              label="cancel" 
              color="primary" 
              v-close-popup 
            />
            <q-btn
              flat
              class="tw-mr-2 tw-mb-4"
              type="submit"
              label="ok" 
              color="negative"
              @click="visitorToDelete"
              v-close-popup 
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useAttendanceService } from '../composables/attendanceService';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/CustomParseFormat'

export default defineComponent({
  name: 'visitor-details',

  async setup() {
    const route = useRoute()
    const data = useAttendanceService()
    const visitor = ref(null)
    const showAddVisitor = ref(false)
    const confirmDelete = ref(false)
    const admitted = ref('admitted')
    const editVisitorPayload = reactive({
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
    };

    function formatedDate(date) {
      dayjs.extend(CustomParseFormat)
      return dayjs(date).format('DD-MMMM')
    }

    function editVisitor() {
      editVisitorPayload.title = visitor.value.title,
      editVisitorPayload.first_name = visitor.value.first_name,
      editVisitorPayload.last_name = visitor.value.last_name,
      editVisitorPayload.email = visitor.value.email,
      editVisitorPayload.phone = visitor.value.phone,
      editVisitorPayload.gender = visitor.value.gender,
      editVisitorPayload.visit.date = visitor.value.visit.date,
      editVisitorPayload.visit.status = visitor.value.visit.status
      if(editVisitorPayload){
        data.editVisitor(route.params.id, editVisitorPayload)
      }
    }

    function visitorToDelete() {
      return data.deleteVisitor(route.params.id)
    }

    function admitVisitor() {
      const admitVisitorStatus = reactive({
        title: visitor.value.title,
        first_name: visitor.value.first_name,
        last_name: visitor.value.last_name,
        email: visitor.value.email,
        phone: visitor.value.phone,
        gender: visitor.value.gender,
        visit: {
          date: visitor.value.visit.date,
          status: admitted.value
        }
      })
      console.log(admitVisitorStatus);
      data.editVisitor(route.params.id, admitVisitorStatus)
    }

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
      showAddVisitor,
      confirmDelete,
      formatedDate,
      visitorToDelete,
      editVisitor,
      admitVisitor
     }
  }
})
</script>