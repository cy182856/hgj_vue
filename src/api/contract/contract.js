import request from '@/utils/request'
import { url } from '@/utils/url'

export function contractList(query) {
  return request({
    url: url + '/contract/list',
    method: 'get',
    params: query
  })
}