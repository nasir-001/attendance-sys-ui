import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export function useAttendanceService() {
  const $q = useQuasar()
  const router = useRouter()
  const trigerNotification = (type, message, icon) => {
    $q.notify({
      type: type,
      message: message,
      position: 'top',
      icon: icon,
      timeout: 2000
    })
  }
  return {
    async attendance(id) {
      const response = await api.get(`/api/attendance/${id}`)
        .catch(() => {
          trigerNotification('negative', 'Failed to view visitor', 'report_problem')
        })
      return response.data;
    },
  };
}