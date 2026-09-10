import apiRequest from './api'


export function getDashboard(
  period = 'today',
) {
  return apiRequest(
    `/api/dashboard?period=${period}`,
  )
}