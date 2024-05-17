import request from '@/utils/request'
import { url } from '@/utils/url'

export function feedbackList(query) {
  return request({
    url: url + '/feedback/list',
    method: 'get',
    params: query
  })
}

