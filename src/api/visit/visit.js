import request from '@/utils/request'
import { url } from '@/utils/url'

export function visitList(query) {
  return request({
    url: url + '/visit/list',
    method: 'get',
    params: query
  })
}
