import axios from 'axios'

import { env } from '@/env'

export interface ApiError {
  response: {
    data: {
      error: {
        message: string
      }
    }
  }
}

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 4000)),
    )

    return config
  })
}
