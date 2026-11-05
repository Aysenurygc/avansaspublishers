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
  | 'call-me'
  | 'contact'
  | 'consultation'

export type InboundPayload = {
  source: LeadSource
  name?: string
  email?: string
  phone?: string
  phoneCc?: string
  message?: string
  result?: unknown
  consent?: boolean
  attribution?: unknown
  /** Honeypot. A real visitor never sees the field, so anything here is a bot. */
  company?: string
}

export const leads = {
  /** Every form on the site ends up here. */
  submit: (data: InboundPayload) => api.post('/inbound', data).then(r => r.data),
}

export type Wording = {
  consent: string
  callbackConfirmation: string
  emailConfirmation: string
  dialCodes: { iso: string; name: string; cc: string }[]
  phone: string | null
}

export const wording = {
  get: (): Promise<Wording> => api.get('/inbound/wording').then(r => r.data),
}

export type HQLead = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  phoneDisplay: string
  source: string
  formType: string
  message: string | null
  said: string | null
  result: unknown
  segment: string | null
  score: number
  hot: boolean
  hotReason: string | null
  consent: boolean
  summary: string
  sourceLine: string
  status: 'NEW' | 'CONTACTED' | 'BOOKED' | 'WON' | 'LOST' | 'JUNK'
  outcome: string | null
  followUpAt: string | null
  assignedTo: string | null
  contactedAt: string | null
  waitingMinutes: number | null
  createdAt: string
}

export type HQEvent = {
  id: string
  kind: string
  detail: string | null
  actor: string | null
  createdAt: string
}

export const hq = {
  today: (): Promise<{ hot: HQLead[]; dueFollowUps: HQLead[]; waiting: number }> =>
    api.get('/leads/today').then(r => r.data),
  inbox: (params: Record<string, string> = {}): Promise<{ leads: HQLead[]; total: number }> =>
    api.get('/leads', { params }).then(r => r.data),
  lead: (
    id: string
  ): Promise<
    HQLead & { answers: { label: string; value: string }[]; events: HQEvent[] }
  > => api.get(`/leads/${id}`).then(r => r.data),
  update: (id: string, data: Record<string, unknown>): Promise<HQLead> =>
    api.patch(`/leads/${id}`, data).then(r => r.data),
  note: (id: string, note: string) => api.post(`/leads/${id}/notes`, { note }).then(r => r.data),
  counts: () => api.get('/leads/counts').then(r => r.data),
  insights: (): Promise<{
    byTool: { formType: string; label: string; leads: number; avgScore: number | null; won: number }[]
    byChannel: { channel: string; leads: number }[]
    byCampaign: { campaign: string; leads: number }[]
  }> => api.get('/leads/insights').then(r => r.data),
}
