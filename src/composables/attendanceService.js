import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export function useAttendanceService() {
  const $q = useQuasar()
  const router = useRouter()
  return {
    async list() {
      const response = await api.get(`/api/attendance`)
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Failed to load visitors',
            icon: 'report_problem'
          })
        })
      return response.data;
    },
    async attendance(id) {
      const response = await api.get(`/api/attendance/${id}`)
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Failed to load visitors',
            icon: 'report_problem'
          })
        })
      return response.data;
    },
    async editVisitor(id, payload) {
      console.log(id);
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Visitor has been editted successfully',
          icon: 'check_circle'
        })
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Failed to edit visitor',
          icon: 'report_problem'
        })
      })
    },
    async newVisitor(payload) {
      const response = await api.post(`/api/attendance/`, payload)
      .then(() => {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Visitor was successfully added',
          icon: 'check_circle'
        })
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Failed to edit visitor',
          icon: 'report_problem'
        })
      })
    },
    async deleteVisitor(id) {
      const response = await api.delete(`/api/attendance/${id}`)
      .then(() => {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Visitor was successfully deleted',
          icon: 'check_circle'
        })
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Failed to delete visitor',
          icon: 'report_problem'
        })
      })
    },
    async filterVisitorByName(name) {
      const response = await api.get(`/api/attendance/?first_name=${name}`)
      .then(() => {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Visitor with that name is found',
          icon: 'done_all'
        })
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Failed to delete visitor',
          icon: 'report_problem'
        })
      })
      return response.data
    }
  };
}