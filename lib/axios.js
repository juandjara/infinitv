import axios from 'axios'

const instance = axios.create()

export function setToken(token) {
  instance.defaults.headers.common['authorization'] = `Bearer ${token}`
}

export default instance
