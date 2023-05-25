import request from '@/utils/request'
import { url } from '@/utils/url'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: url + '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: url + '/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
