import request from '@/utils/request'
import { url } from '@/utils/url'

export function cardTypeSelect() {
  return request({
    url: url + '/cardType/select',
    method: 'get'
  })
}