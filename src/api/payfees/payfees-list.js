import request from '@/utils/request'
import { url } from '@/utils/url'

export function payFeesList(query) {
  return request({
    url: url + '/payFees/list',
    method: 'get',
    params: query
  })
}

