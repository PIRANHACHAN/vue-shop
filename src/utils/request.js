import axios from 'axios'
import { Message } from 'element-ui'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建一个axios的对象
const $http = axios.create({
  baseURL: 'http://api.piranhachan.top/api/private/v1/',
  // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 8000,
})

// request拦截器
$http.interceptors.request.use(
  (config) => {
    // 页面顶端进度条
    Nprogress.start()

    config.headers['authorization'] = window.sessionStorage.getItem('token')
    return config
  },
  (error) => {
    Message.error('请求超时，请重试！')
    return Promise.reject(error)
  }
)

//response拦截器
$http.interceptors.response.use(
  (response) => {
    Nprogress.done()

    const res = response.data
    if (res.meta.status !== 200) {
      if (res.meta.status !== 201) {
        Message({
          type: 'error',
          message: res.meta.msg,
        })
        return
      }
    }
    return res
  },
  (error) => {
    Message.error('请求失败，请稍后重试！')
    return Promise.reject(error)
  }
)

export default $http
