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


export function createIntoCstQrCode(data) {
  return request({
    url: url + '/cst/createIntoCstQrCode',
    method: 'post',
    data
  })
}

export function createIntoStaffQrCode(data) {
  return request({
    url: url + '/cst/createIntoStaffQrCode',
    method: 'post',
    data
  })
}

export function saveCstMenu(data) {
  return request({
    url: url + '/cst/saveCstMenu',
    method: 'post',
    data
  })
}