import request from '@/utils/request'
import { url } from '@/utils/url'

export function cstList(query) {
  return request({
    url: url + '/cst/list',
    method: 'get',
    params: query
  })
}

export function createQrCode(query) {
  return request({
    url: url + '/cst/createQrCode',
    method: 'get',
    params: query
  })
}

export function saveCstMenu(data) {
  return request({
    url: url + '/cst/saveCstMenu',
    method: 'post',
    data
  })
}