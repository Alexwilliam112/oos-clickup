import { apiClient } from '../api/api-client.mjs'

const taskService = {
  async getTasks() {
    console.log('called get Tasks')
    const response = await apiClient.get(ENDPOINTS.GET_TASKS)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getMyTask() {
    const response = await apiClient.get(ENDPOINTS.GET_MY_TASK)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getTaskInitialValues() {
    const response = await apiClient.get(ENDPOINTS.GET_TASK_INITIAL_VALUES)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async createTask({ payload }) {
    const response = await apiClient.post(ENDPOINTS.CREATE_TASK, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async updateTask({ payload }) {
    const response = await apiClient.post(ENDPOINTS.UPDATE_TASK, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async uploadFile({ payload }) {
    const response = await apiClient.post(ENDPOINTS.UPLOAD_FILE, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
}

const ENDPOINTS = {
  GET_TASKS: '/task/index',
  GET_MY_TASK: '/my-task/index',
  GET_TASK_INITIAL_VALUES: '/utils/task-initial-values',

  CREATE_TASK: '/task/create',
  UPDATE_TASK: '/task/update',
  UPLOAD_FILE: '/utils/file-upload',
}

export default taskService
