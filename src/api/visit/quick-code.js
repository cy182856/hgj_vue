import request from '@/utils/request'
import { url } from '@/utils/url'

export function quickCodeList(query) {
  return request({
    url: url + '/opendoor/quickCode/list',
    method: 'get',
    params: query
  })
}
