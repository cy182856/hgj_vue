import request from '@/utils/request'
import { url } from '@/utils/url'


export function projectSelect() {
  return request({
    url: url + '/config/select',
    method: 'get'
  })
}
