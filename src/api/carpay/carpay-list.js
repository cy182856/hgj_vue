import request from '@/utils/request'
import { url } from '@/utils/url'

export function carPayList(query) {
  return request({
    url: url + '/carPay/list',
    method: 'get',
    params: query
  })
}

