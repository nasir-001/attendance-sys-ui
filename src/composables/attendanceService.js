import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar()

export function useAttendanceService() {
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
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Visitor was successfully editted',
          icon: 'mark'
        })
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Failed to edit visitor',
          icon: 'report_problem'
        })
      })
      return response.data;
    }
  };
}