import Vue from 'vue'
import axios from 'axios'

const { NODE_ENV, VUE_APP_FETCH_URL } = process.env
// 创建实例时设置配置的默认值
const instance = axios.create({
  baseURL: NODE_ENV === 'development' ? '' : process.env.VUE_APP_FETCH_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

instance.defaults.timeout = 5000

// 添加请求拦截器
instance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// 添加响应拦截器
instance.interceptors.response.use(
  ({ data }) => data,
  error => Promise.reject(error)
)

Vue.prototype.axios = instance

export default instance
