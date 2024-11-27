import request from '@/utils/request'
import { url } from '@/utils/url'

export function cardBillList(query) {
  return request({
    url: url + '/card/bill/list',
    method: 'get',
    params: query
  })
}
