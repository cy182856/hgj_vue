import request from '@/utils/request'
import { url } from '@/utils/url'

export function couponGrantList(query) {
  return request({
    url: url + '/couponGrant/list',
    method: 'get',
    params: query
  })
}

export function couponGrantSelect() {
  return request({
    url: url + '/couponGrant/select',
    method: 'get'
  })
}

export function couponGrantDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/couponGrant/delete',
    method: 'get',
    params: { id }
  })
}

export function couponGrantSave(data) {
  return request({
    url: url + '/couponGrant/save',
    method: 'post',
    data
  })
}

export function couponGrantUpdate(data) {
  return request({
    url: url + '/couponGrant/save',
    method: 'post',
    data
  })
}


