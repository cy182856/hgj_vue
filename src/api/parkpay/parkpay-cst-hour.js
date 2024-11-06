import request from '@/utils/request'
import { url } from '@/utils/url'

export function sendHourByTag(data) {
  return request({
    url: url + '/parkPayCstHour/sendHourByTag',
    method: 'post',
    data
  })
}

export function sendHourByCst(data) {
  return request({
    url: url + '/parkPayCstHour/sendHourByCst',
    method: 'post',
    data
  })
}

export function rechargeByTag(data) {
  return request({
    url: url + '/parkPayCstHour/rechargeByTag',
    method: 'post',
    data
  })
}

export function cstHourRecharge(data) {
  return request({
    url: url + '/parkPayCstHour/cstHourRecharge',
    method: 'post',
    data
  })
}

export function cstHourRenewal(data) {
  return request({
    url: url + '/parkPayCstHour/cstHourRenewal',
    method: 'post',
    data
  })
}

export function renewalByTag(data) {
  return request({
    url: url + '/parkPayCstHour/renewalByTag',
    method: 'post',
    data
  })
}

export function cstHourList(query) {
  return request({
    url: url + '/parkPayCstHour/list',
    method: 'get',
    params: query
  })
}

export function cstHourDisable(id) {
  return request({
    url: url + '/parkPayCstHour/disable',
    method: 'get',
    params: { id }
  })
}

export function cstHourSecure(id) {
  return request({
    url: url + '/parkPayCstHour/secure',
    method: 'get',
    params: { id }
  })
}



