import { apiClient } from '../api/api-client.mjs'

const workspaceService = {
  async getTeams() {
    const response = await apiClient.get(ENDPOINTS.GET_TEAMS)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getFolders() {
    const response = await apiClient.get(ENDPOINTS.GET_FOLDERS)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getList() {
    const response = await apiClient.get(ENDPOINTS.GET_LIST)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getPageInfo() {
    const response = await apiClient.get(ENDPOINTS.GET_PAGE_INFO)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async getWorkspaceMembers() {
    const response = await apiClient.get(ENDPOINTS.GET_WORKSPACE_MEMBER)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async createTeams({ payload }) {
    const response = await apiClient.get(ENDPOINTS.GET_TEAMS, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async createFolders({ payload }) {
    const response = await apiClient.get(ENDPOINTS.GET_FOLDERS, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },

  async createList({ payload }) {
    const response = await apiClient.get(ENDPOINTS.GET_LIST, payload)

    const { data, error, message } = response.data

    if (error) throw new Error(message)

    return data
  },
}

const ENDPOINTS = {
  GET_TEAMS: '/team/index',
  GET_FOLDERS: '/folder/index',
  GET_LIST: '/lists/index',
  GET_PAGE_INFO: '/page-info',
  GET_WORKSPACE_MEMBER: '/workspace-member/index',

  CREATE_TEAMS: '/team/create',
  CREATE_FOLDERS: '/folder/create',
  CREATE_LIST: '/lists/create',
}

export default workspaceService
