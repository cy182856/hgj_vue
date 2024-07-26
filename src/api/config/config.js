import request from '@/utils/request'
import { url } from '@/utils/url'


export function projectSelect() {
  return request({
    url: url + '/config/select',
    method: 'get'
  })
}

export function project() {
  return request({
    url: url + '/config/project',
    method: 'get'
  })
}

export function corpSelect() {
  return request({
    url: url + '/config/corp',
    method: 'get'
  })
}
