import request from '@/utils/request'
import { url } from '@/utils/url'

export function personInfoList(query) {
  return request({
    url: url + '/opendoor/personInfo/list',
    method: 'get',
    params: query
  })
}
