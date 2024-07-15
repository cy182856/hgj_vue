import request from '@/utils/request'
import { url } from '@/utils/url'

export function menuList(query) {
  return request({
    url: url + '/menu/list',
    method: 'get',
    params: query
  })
}
