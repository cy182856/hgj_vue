import request from '@/utils/request'
import { url } from '@/utils/url'


export function wechatPubSelect() {
  return request({
    url: url + '/wechatPub/select',
    method: 'get'
  })
}

export function wechatPubAddMenu(data) {
  return request({
    url: url + '/wechatPub/addMenu',
    method: 'post',
    data
  })
}

