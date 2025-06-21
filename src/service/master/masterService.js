import { apiClient } from '../api/api-client.mjs'

const masterService = {
  async getTaskType() {
    const response = await apiClient.get(MASTER_API.GET_TASK_TYPE)

    const { data, error, message } = response.data

    if (error) throw new Error(message)
  },
}

const MASTER_API = {
  GET_TASK_TYPE: '/task-type/index',
}

export { masterService }
