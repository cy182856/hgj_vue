import request from '@/utils/request'
import { url } from '@/utils/url'

export function houseList(query) {
  return request({
    url: url + '/house/list',
    method: 'get',
    params: query
  })
}

export function createQrCode(query) {
  return request({
    url: url + '/house/createQrCode',
    method: 'get',
    params: query
  })
}