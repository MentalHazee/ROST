import axios from 'axios'
import { BASE_URL } from './index'

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
