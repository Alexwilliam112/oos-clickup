'use client'

import { apiClient } from '../api/api-client.mjs'

const masterService = {
  async getTaskTypes() {
    const response = await apiClient.get(MASTER_API.GET_TASK_TYPE)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
  async getStatuses() {
    const response = await apiClient.get(MASTER_API.GET_STATUS)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
  async getPriorities() {
    const response = await apiClient.get(MASTER_API.GET_PRIORITY)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
  async getProducts() {
    const response = await apiClient.get(MASTER_API.GET_PRODUCT)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
  async getTeams() {
    const response = await apiClient.get(MASTER_API.GET_TEAM)

    const { data, error, message } = response.data

    console.log(data)

    if (error) throw new Error(message)

    return data
  },
  async getFolders() {
    const response = await apiClient.get(MASTER_API.GET_FOLDERS)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
  async getList() {
    const response = await apiClient.get(MASTER_API.GET_LIST)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
}

const MASTER_API = {
  GET_TASK_TYPE: '/task-type/index',
  GET_STATUS: '/status/index',
  GET_PRIORITY: '/priority/index',
  GET_PRODUCT: '/product/index',
  GET_TEAM: '/team-select/index',
  GET_FOLDERS: '/folder-select/index',
  GET_LIST: '/list-select/index',
}

export default masterService
