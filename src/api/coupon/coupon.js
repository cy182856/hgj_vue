import request from '@/utils/request'
import { url } from '@/utils/url'

export function couponList(query) {
  return request({
    url: url + '/coupon/list',
    method: 'get',
    params: query
  })
}

export function couponBatchList(id) {
  return request({
    url: url + '/coupon/batchList',
    method: 'get',
    params: { id }
  })
}

export function couponSelect() {
  return request({
    url: url + '/coupon/select',
    method: 'get'
  })
}

export function couponDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/coupon/delete',
    method: 'get',
    params: { id }
  })
}

export function batchDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/coupon/batchDelete',
    method: 'get',
    params: { id }
  })
}

export function batchRecharge(data) {
  return request({
    url: url + '/coupon/batchRecharge',
    method: 'post',
    data
  })
}

export function couponGrant(data) {
  return request({
    url: url + '/coupon/grant',
    method: 'post',
    data
  })
}

export function couponSave(data) {
  return request({
    url: url + '/coupon/save',
    method: 'post',
    data
  })
}

export function couponUpdate(data) {
  return request({
    url: url + '/coupon/save',
    method: 'post',
    data
  })
}


