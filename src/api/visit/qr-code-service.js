import request from '@/utils/request'
import { url } from '@/utils/url'

export function qrCodeServiceList(query) {
  return request({
    url: url + '/opendoor/qrCodeService/list',
    method: 'get',
    params: query
  })
}
