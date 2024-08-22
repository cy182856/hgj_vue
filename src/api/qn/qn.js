import request from '@/utils/request'
import { url } from '@/utils/url'

export function gonggaoUpdateRelease() {
  return request({
    url: url + '/gonggao/updateRelease',
    method: 'get'
  })
}

export function getGonggao(id) {
  return request({
    url: url + '/gonggao/get',
    method: 'get',
    params: { id }
  })
}

export function qnList(query) {
  return request({
    url: url + '/qn/list',
    method: 'get',
    params: query
  })
}

export function gonggaoSelect() {
  return request({
    url: url + '/gonggao/select',
    method: 'get'
  })
}

export function gonggaoDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/gonggao/delete',
    method: 'get',
    params: { id }
  })
}

export function gonggaoNotIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/gonggao/notIsShow',
    method: 'get',
    params: { id }
  })
}

export function gonggaoView(id) {
  return request({
    url: url + '/gonggao/view',
    method: 'get',
    params: { id }
  })
}

export function qnMiniIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/qn/miniIsShow',
    method: 'get',
    params: { id }
  })
}

export function qnNotMiniIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/qn/notMiniIsShow',
    method: 'get',
    params: { id }
  })
}

export function qnDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/qn/delete',
    method: 'get',
    params: { id }
  })
}

export function qnPubMenuIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/qn/pubMenuIsShow',
    method: 'get',
    params: { id }
  })
}

export function qnNotPubMenuIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/qn/notPubMenuIsShow',
    method: 'get',
    params: { id }
  })
}

export function qnSave(data) {
  return request({
    url: url + '/qn/save',
    method: 'post',
    data
  })
}

