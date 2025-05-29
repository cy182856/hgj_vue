import request from '@/utils/request'
import { url } from '@/utils/url'

export function identitySelect() {
  return request({
    url: url + '/identity/select',
    method: 'get'
  })
}

export function identitySelectByProNums(data) {
  return request({
    url: url + '/identity/selectByProNums',
    method: 'post',
    data
  })
}

export function identitySelectByProNum(proNum) {
  return request({
    url: url + '/identity/selectByProNum',
    method: 'get',
    params: { proNum }
  })
}