import request from '@/utils/request'
import { url } from '@/utils/url'

export function stopCouponGrantList(query) {
  return request({
    url: url + '/stopCouponGrant/list',
    method: 'get',
    params: query
  })
}

export function stopCouponGrantSelect() {
  return request({
    url: url + '/stopCouponGrant/select',
    method: 'get'
  })
}

export function stopCouponGrantDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/stopCouponGrant/delete',
    method: 'get',
    params: { id }
  })
}

export function stopCouponGrantSave(data) {
  return request({
    url: url + '/stopCouponGrant/save',
    method: 'post',
    data
  })
}

export function stopCouponGrantUpdate(data) {
  return request({
    url: url + '/stopCouponGrant/save',
    method: 'post',
    data
  })
}


