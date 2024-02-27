import request from '@/utils/request'
import { url } from '@/utils/url'

export function cstIntoList(query) {
  return request({
    url: url + '/cstInto/list',
    method: 'get',
    params: query
  })
}

export function deleteCstInto(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/cstInto/delete',
    method: 'get',
    params: { id }
  })
}

export function ownerCstInto(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/cstInto/owner',
    method: 'get',
    params: { id }
  })
}

