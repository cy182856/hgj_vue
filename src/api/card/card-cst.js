import request from '@/utils/request'
import { url } from '@/utils/url'

export function sendCardByTag(data) {
  return request({
    url: url + '/cardCst/sendCardByTag',
    method: 'post',
    data
  })
}

export function sendCardByCst(data) {
  return request({
    url: url + '/cardCst/sendCardByCst',
    method: 'post',
    data
  })
}

export function cardBulkOperation(data) {
  return request({
    url: url + '/cardCst/cardBulkOperation',
    method: 'post',
    data
  })
}

export function rechargeByTag(data) {
  return request({
    url: url + '/cardCst/rechargeByTag',
    method: 'post',
    data
  })
}

export function cardRecharge(data) {
  return request({
    url: url + '/cardCst/cardRecharge',
    method: 'post',
    data
  })
}

export function cardRenewal(data) {
  return request({
    url: url + '/cardCst/cardRenewal',
    method: 'post',
    data
  })
}

export function renewalByTag(data) {
  return request({
    url: url + '/cardCst/renewalByTag',
    method: 'post',
    data
  })
}

export function cardCstList(query) {
  return request({
    url: url + '/cardCst/list',
    method: 'get',
    params: query
  })
}

export function cardDisable(id) {
  return request({
    url: url + '/cardCst/disable',
    method: 'get',
    params: { id }
  })
}

export function cardSecure(id) {
  return request({
    url: url + '/cardCst/secure',
    method: 'get',
    params: { id }
  })
}



