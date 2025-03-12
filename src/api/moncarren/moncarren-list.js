import request from '@/utils/request'
import { url } from '@/utils/url'

export function monCarRenList(query) {
  return request({
    url: url + '/monCarRen/list',
    method: 'get',
    params: query
  })
}

