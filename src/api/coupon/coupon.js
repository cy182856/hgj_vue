import request from '@/utils/request'
import { url } from '@/utils/url'

export function stopCouponList(query) {
  return request({
    url: url + '/stopCoupon/list',
    method: 'get',
    params: query
  })
}

export function stopCouponBatchList(id) {
  return request({
    url: url + '/stopCoupon/batchList',
    method: 'get',
    params: { id }
  })
}

export function stopCouponSelect() {
  return request({
    url: url + '/stopCoupon/select',
    method: 'get'
  })
}

export function stopCouponDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/stopCoupon/delete',
    method: 'get',
    params: { id }
  })
}

export function stopCouponGrant(data) {
  return request({
    url: url + '/stopCoupon/grant',
    method: 'post',
    data
  })
}

export function stopCouponSave(data) {
  return request({
    url: url + '/stopCoupon/save',
    method: 'post',
    data
  })
}

export function stopCouponUpdate(data) {
  return request({
    url: url + '/stopCoupon/save',
    method: 'post',
    data
  })
}


