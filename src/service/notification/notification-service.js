'use client'

const { apiClient } = require('../api/api-client.mjs')

const notificationService = {
  async getAll() {
    const { data } = await apiClient.get(NOTIFICATION_API.GET_NOTIFICATION)

    return data
  },

  async postRead({ payload, params }) {
    const { data } = await apiClient.post(NOTIFICATION_API.POST_READ_NOTIFICATION, payload, { params })

    return data
  },
}

const NOTIFICATION_API = {
  GET_NOTIFICATION: '/notification/index',
  POST_READ_NOTIFICATION: '/notification/read-unread',
}

export default notificationService
