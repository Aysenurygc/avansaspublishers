import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  }
)

export default api

export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
}

export const consultations = {
  create: (data: Record<string, unknown>) => api.post('/consultations', data).then(r => r.data),
}

export const projects = {
  list: () => api.get('/projects').then(r => r.data),
  get: (id: string) => api.get(`/projects/${id}`).then(r => r.data),
  sendMessage: (id: string, content: string) =>
    api.post(`/projects/${id}/messages`, { content }).then(r => r.data),
}

export const blog = {
  list: () => api.get('/blog').then(r => r.data),
  get: (slug: string) => api.get(`/blog/${slug}`).then(r => r.data),
}

export const contact = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data).then(r => r.data),
}

export type LeadSource =
  | 'book-readiness-scorecard'
  | 'is-it-a-book'
  | 'opening-pages-appraisal'
  | 'memoir-story-mapper'
  | 'scope-cost-estimator'

export const leads = {
  submit: (data: {
    email: string
    name?: string
    source: LeadSource
    result?: unknown
    consent: boolean
  }) => api.post('/leads', data).then(r => r.data),
}
