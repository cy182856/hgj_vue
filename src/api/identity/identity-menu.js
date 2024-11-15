import request from '@/utils/request'
import { url } from '@/utils/url'

export function saveIdentityMenu(data) {
  return request({
    url: url + '/identity/menu/saveIdentityMenu',
    method: 'post',
    data
  })
}







