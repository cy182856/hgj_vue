import request from '@/utils/request'
import { url } from '@/utils/url'

export function cardQrCodeList(query) {
  return request({
    url: url + '/card/qrCode/list',
    method: 'get',
    params: query
  })
}
