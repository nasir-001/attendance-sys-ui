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
    }
  };
}