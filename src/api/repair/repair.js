import request from '@/utils/request'
import { url } from '@/utils/url'

export function repairList(query) {
  return request({
    url: url + '/repair/list',
    method: 'get',
    params: query
  })
}
