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

// Request interceptor
apiClient.interceptors.request.use(function (request) {
  console.log('Request', request.params)

  if (typeof window === 'undefined') {
    return request
  }

  const params = new URLSearchParams(window.location.search) || ''

  request.params.workspace_id = params.get('workspace_id')
  request.params.page = params.get('page')
  request.params.param_id = params.get('param_id')

  return request
})

// Response interceptor
apiClientV2.interceptors.response.use(function (response) {
  const { data, error, message } = response.data

  console.log('Response', response.data)

  if (error) return Promise.reject(message)

  response.data = data

  return response
})

export { apiClient, apiClientV2 }
