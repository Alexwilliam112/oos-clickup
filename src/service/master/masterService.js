import { apiClient, apiClientV2 } from '../api/api-client.mjs'

const masterService = {
  async getTaskTypes() {
    const { data } = await apiClientV2.get(MASTER_API.GET_TASK_TYPE)
    return data
  },
  async getStatuses() {
    const { data } = await apiClientV2.get(MASTER_API.GET_STATUS)
    return data
  },
  async getPriorities() {
    const { data } = await apiClientV2.get(MASTER_API.GET_PRIORITY)
    return data
  },
  async getProducts() {
    const { data } = await apiClientV2.get(MASTER_API.GET_PRODUCT)
    return data
  },
  async getTeams() {
    const { data } = await apiClientV2.get(MASTER_API.GET_TEAM)
    return data
  },
  async getFolders() {
    const { data } = await apiClientV2.get(MASTER_API.GET_FOLDERS)
    return data
  },
  async getList() {
    const { data } = await apiClientV2.get(MASTER_API.GET_LIST)
    return data
  },
}

const MASTER_API = {
  GET_TASK_TYPE: '/task-type/index',
  GET_STATUS: '/status/index',
  GET_PRIORITY: '/priority',
  GET_PRODUCT: '/product/index',
  GET_TEAM: '/team-select/index',
  GET_FOLDERS: '/folder-select/index',
  GET_LIST: '/list-select/index',
}

export { masterService }
