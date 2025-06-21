'use client'

import axios from 'axios'

const BASE_URL = process.env.PUBLIC_NEXT_BASE_URL || ''
const TOKEN = process.env.PUBLIC_NEXT_OOS_TOKEN || ''

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    token: TOKEN,
  },
})

const apiClientV2 = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClientV2.interceptors.response.use(function (response) {
  const { data, error, message } = response.data

  if (error) return Promise.reject(message)

  response.data = data

  return response
})

export { apiClient, apiClientV2 }
