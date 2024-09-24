import request from '@/utils/request'
import { url } from '@/utils/url'

export function qrCodeList(query) {
  return request({
    url: url + '/opendoor/qrCode/list',
    method: 'get',
    params: query
  })
}
