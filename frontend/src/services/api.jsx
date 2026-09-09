const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000'

async function apiRequest(
  path,
  options = {},
) {
  const token = localStorage.getItem(
    'riderjob_access_token',
  )

  const headers = new Headers(
    options.headers || {},
  )

  headers.set(
    'Content-Type',
    'application/json',
  )

  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`,
    )
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    },
  )

  let data = null

  try {
    data = await response.json()
  } catch {
    // Response does not contain JSON.
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        'Something went wrong.',
    )
  }

  return data
}

export default apiRequest