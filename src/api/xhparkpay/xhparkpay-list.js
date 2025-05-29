import request from '@/utils/request'
import { url } from '@/utils/url'

export function xhParkPayList(query) {
  return request({
    url: url + '/xhParkPay/list',
    method: 'get',
    params: query
  })
}

