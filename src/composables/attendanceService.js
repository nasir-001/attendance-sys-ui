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
    async list() {
      const response = await api.get(`/api/attendance`)
        .catch(() => {
          trigerNotification('negative', 'Failed to load visitors', 'report_problem')
        })
      return response.data;
    },
    async attendance(id) {
      const response = await api.get(`/api/attendance/${id}`)
        .catch(() => {
          trigerNotification('negative', 'Failed to view visitor', 'report_problem')
        })
      return response.data;
    },
    async editVisitor(id, payload) {
      console.log(id);
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        trigerNotification('positive', 'Visitor has been editted successfully', 'check_circle')
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        trigerNotification('negative', 'Failed to edit visitor', 'report_problem')
      })
    },
    async admitVisitor(id, payload) {
      console.log(id);
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        trigerNotification('positive', 'Visitor has been admitted', 'check_circle')
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        trigerNotification('negative', 'Failed to admit visitor', 'report_problem')
      })
    },
    async cancelVisitor(id, payload) {
      console.log(id);
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        trigerNotification('positive', 'Visitor has been admitted', 'check_circle')
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        trigerNotification('negative', 'Failed to admit visitor', 'report_problem')
      })
    },
    async visitorDepart(id, payload) {
      console.log(id);
      const response = await api.patch(`/api/attendance/${id}`, payload)
      .then(() => {
        trigerNotification('positive', 'Visitor has been departed', 'check_circle')
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        trigerNotification('negative', 'Failed to depart visitor', 'report_problem')
      })
    },
    async newVisitor(payload) {
      const response = await api.post(`/api/attendance/`, payload)
      .then(() => {
        trigerNotification('positive', 'Visitor was successfully added', 'check_circle')
      })
      .then(() => {
        router.push({ name: 'dashborad' })
      })
      .catch(() => {
        trigerNotification('negative', 'Failed to edit visitor', 'report_problem')
      })
    },
    async filterVisitorByName(name) {
      const response = await api.get(`/api/attendance/?first_name=${name}`)
      .then(() => {
        trigerNotification('positive', "Found match visitor's name", 'done_all')
      })
      .catch(() => {
        trigerNotification('negative', "Couldn't find visitor with that name", 'report_problem')
      })
      return response.data
    }
  };
}