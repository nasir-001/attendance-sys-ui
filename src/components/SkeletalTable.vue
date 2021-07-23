<template>  
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <div class="q-pa-md q-mt-lg tw-w-full xl:tw-w-5/6 tw-h-5/6 tw-mx-auto">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 6" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="QAvatar" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="40px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-btn
        round
        class="tw-float-right tw-mt-4 tw-bottom-0"
        color="primary"
        size="16px"
        icon="add"
        to="new-visitor"
      />
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SkeletalTable'
})
</script>