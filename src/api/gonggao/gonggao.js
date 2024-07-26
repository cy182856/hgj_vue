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

export function gonggaoList(query) {
  return request({
    url: url + '/gonggao/list',
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

export function gonggaoIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/gonggao/isShow',
    method: 'get',
    params: { id }
  })
}

export function gonggaoSave(data) {
  return request({
    url: url + '/gonggao/save',
    method: 'post',
    data
  })
}

export function gonggaoUpdate(data) {
  return request({
    url: url + '/gonggao/save',
    method: 'post',
    data
  })
}
