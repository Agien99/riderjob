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