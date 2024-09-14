import request from '@/utils/request'
import { url } from '@/utils/url'


export function couponTypeSelect() {
  return request({
    url: url + '/coupon/type/select',
    method: 'get'
  })
}
