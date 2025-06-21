'use client'

import { apiClient } from '../api/api-client.mjs'

const authService = {
  async getUser(payload = {}) {
    const response = await apiClient.post('/auth/me', payload)
    return response.data.data
  },
}

export { authService }
