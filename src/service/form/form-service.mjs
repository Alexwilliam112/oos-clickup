import { apiClient } from '../api/api-client.mjs'

const formService = {
  async getForms() {
    console.log('called getForms');

    const response = await apiClient.get(ENDPOINTS.GET_FORMS);

    const { data, error, message } = response.data;

    if (error) throw new Error(message);

    return data;
  }
}

const ENDPOINTS = {
  GET_FORMS: '/form/get-all'
}

export default formService
