const API_TIMEOUT = 30000 // 30s

export function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  return fetch(url, { ...options, headers, signal: controller.signal })
    .then((res) => {
      clearTimeout(timeoutId)
      if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return res
    })
    .catch((err) => {
      clearTimeout(timeoutId)
      throw err
    })
}
