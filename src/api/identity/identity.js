import request from '@/utils/request'
import { url } from '@/utils/url'

export function identitySelect() {
  return request({
    url: url + '/identity/select',
    method: 'get'
  })
}







