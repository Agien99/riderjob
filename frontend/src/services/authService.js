import apiRequest from './api'

export function registerUser(
  email,
  password,
  displayName,
) {
  return apiRequest(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        display_name: displayName,
      }),
    },
  )
}

export function loginUser(
  email,
  password,
) {
  return apiRequest(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  )
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me')
}