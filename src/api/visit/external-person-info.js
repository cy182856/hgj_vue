import request from '@/utils/request'
import { url } from '@/utils/url'

export function personInfoList(query) {
  return request({
    url: url + '/opendoor/personInfo/list',
    method: 'get',
    params: query
  })
}

export function personInfoListDelete(id) {
  return request({
    url: url + '/opendoor/personInfo/delete',
    method: 'get',
    params: { id }
  })
}
