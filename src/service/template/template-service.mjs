'use client'

import { apiClient } from '../api/api-client.mjs'

const templateService = {
  async getSomething() {
    const response = await apiClient.get('/mockapi')

    return response.data
  },
}

export { templateService }
