import request from '@/utils/request'
import { url } from '@/utils/url'

export function openDoorLog(cardNo) {
  return request({
    url: url + '/opendoor/log',
    method: 'get',
    params: { cardNo }
  })
}
