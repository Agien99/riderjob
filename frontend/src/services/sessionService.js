import apiRequest from './api'

export function startRiderSession(
  sessionData,
) {
  return apiRequest(
    '/api/sessions/start',
    {
      method: 'POST',
      body: JSON.stringify(
        sessionData,
      ),
    },
  )
}

export function getActiveSession() {
  return apiRequest(
    '/api/sessions/active',
  )
}

export function endRiderSession(
  sessionId,
  sessionData,
) {
  return apiRequest(
    `/api/sessions/${sessionId}/end`,
    {
      method: 'POST',
      body: JSON.stringify(
        sessionData,
      ),
    },
  )
}

export function getSessionHistory() {
  return apiRequest(
    '/api/sessions',
  )
}

export function getSessionDetail(
  sessionId,
) {
  return apiRequest(
    `/api/sessions/${sessionId}`,
  )
}

export function updateRiderSession(
  sessionId,
  sessionData,
) {
  return apiRequest(
    `/api/sessions/${sessionId}`,
    {
      method: 'PUT',
      body: JSON.stringify(
        sessionData,
      ),
    },
  )
}

export function deleteRiderSession(
  sessionId,
) {
  return apiRequest(
    `/api/sessions/${sessionId}`,
    {
      method: 'DELETE',
    },
  )
}