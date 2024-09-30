import request from '@/utils/request'
import { url } from '@/utils/url'

export function couponQrCodeList(query) {
  return request({
    url: url + '/coupon/qrCode/list',
    method: 'get',
    params: query
  })
}
