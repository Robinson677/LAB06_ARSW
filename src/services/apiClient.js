import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  },
)


const apiclient = {
  getAll: async () => {
    const { data } = await api.get('/blueprints')
    return data
  },
  getByAuthor: async (author) => {
    const { data } = await api.get(`/blueprints/${author}`)
    return data
  },
  getByAuthorAndName: async (author, name) => {
    const { data } = await api.get(`/blueprints/${author}/${name}`)
    return data
  },
  create: async (blueprint) => {
    const { data } = await api.post('/blueprints', blueprint)
    return data
  },
  update: async (author, name, blueprint) => {
    const { data } = await api.put(`/blueprints/${author}/${name}`, blueprint)
    return data
  },
  remove: async (author, name) => {
    await api.delete(`/blueprints/${author}/${name}`)
  },
}

export { api }    // por si LoginPage necesita hacer post directo
export default apiclient