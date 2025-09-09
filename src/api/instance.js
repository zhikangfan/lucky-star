import axios from 'axios'
import router from '@/router/index.js'
import PubSub from 'pubsub-js'
const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 60 * 5, // 5分钟超时
  withCredentials: true, // 携带cookie
})
const responseFullFilledHandler = (response) => {
  console.log( encodeURIComponent(window.location.pathname + window.location.search))
  if (response.data.code === 401) {
    router.replace({
      path: '/login',
      query: {
        redirect: encodeURIComponent(window.location.pathname + window.location.search)
      }
    })
  }
  if (response.data.code === 500) {

  }
  return response.data;
}
const responseRejectedHandler = (err) => {
  PubSub.publishSync('networkError')
  throw err;
}
http.interceptors.response.use(responseFullFilledHandler, responseRejectedHandler)

export default http
