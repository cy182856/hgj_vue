import request from '@/utils/request'
import { url } from '@/utils/url'

export function constantList(query) {
  return request({
    url: url + '/constant/list',
    method: 'get',
    params: query
  })
}
