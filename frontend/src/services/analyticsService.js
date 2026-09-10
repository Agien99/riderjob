import apiRequest from './api'


export function getAnalytics(
  period = '30d',
) {
  return apiRequest(
    `/api/analytics?period=${period}`,
  )
}