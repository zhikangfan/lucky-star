import axios from 'axios'
import router from '@/router/index.js'

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 60 * 5, // 5分钟超时
  withCredentials: true, // 携带cookie
})
const responseFullFilledHandler = (response) => {
  if (response.data.status === 401) {
    router.replace({
      path: '/login'
    })
  }
  if (response.data.status === 500) {

  }
  return response.data;
}
const responseRejectedHandler = (err) => {
  // return Promise.reject(err);
  // TODO: 通知网络错误
  throw err;
}
http.interceptors.response.use(responseFullFilledHandler, responseRejectedHandler)

export default http
