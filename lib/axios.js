import axios from 'axios'

const instance = axios.create()

export function setToken(token) {
  axios.defaults.headers['Authorization'] = `Bearer ${token}`
}

export default instance
