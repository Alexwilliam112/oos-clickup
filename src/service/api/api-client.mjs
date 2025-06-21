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

export { apiClient }
