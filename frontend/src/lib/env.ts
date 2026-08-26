const apiUrl =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8000/api'

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
} as const

