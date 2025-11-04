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
  if(localStorage.getItem('user-store')){
    request.params.user_id = JSON.parse(localStorage.getItem('user-store')).state.user_id 
  }



  return request
})

export { apiClient }
