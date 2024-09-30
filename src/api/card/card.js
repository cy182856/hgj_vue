import request from '@/utils/request'
import { url } from '@/utils/url'

export function cardSelect() {
  return request({
    url: url + '/card/select',
    method: 'get'
  })
}