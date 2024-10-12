import request from '@/utils/request'
import { url } from '@/utils/url'

export function cstIntoList(query) {
  return request({
    url: url + '/cstInto/list',
    method: 'get',
    params: query
  })
}

export function deleteCstInto(id,cstIntoHouseId) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/cstInto/delete',
    method: 'get',
    params: { id,cstIntoHouseId }
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

export function cohabitCstInto(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/cstInto/cohabit',
    method: 'get',
    params: { id }
  })
}

