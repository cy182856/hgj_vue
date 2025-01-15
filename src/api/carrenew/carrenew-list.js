import request from '@/utils/request'
import { url } from '@/utils/url'

export function carRenewList(query) {
  return request({
    url: url + '/carRenew/list',
    method: 'get',
    params: query
  })
}

