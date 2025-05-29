import request from '@/utils/request'
import { url } from '@/utils/url'

export function openDoorLog(cardNo) {
  return request({
    url: url + '/opendoor/log',
    method: 'get',
    params: { cardNo }
  })
}

export function openDoorList(query) {
  return request({
    url: url + '/opendoor/list',
    method: 'get',
    params: query
  })
}
