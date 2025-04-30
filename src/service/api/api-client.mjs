'use client'

import axios from 'axios'

const BASE_URL = 'https://api-oos.jojonomic.com/27414'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { apiClient }
