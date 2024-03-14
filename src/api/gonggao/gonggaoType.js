import request from '@/utils/request'
import { url } from '@/utils/url'

export function gonggaoTypeList(query) {
  return request({
    url: url + '/gonggaoType/list',
    method: 'get',
    params: query
  })
}

export function gonggaoTypeSelect() {
  return request({
    url: url + '/gonggaoType/select',
    method: 'get'
  })
}

export function gonggaoTypeDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/gonggaoType/delete',
    method: 'get',
    params: { id }
  })
}

export function gonggaoTypeSave(data) {
  return request({
    url: url + '/gonggaoType/save',
    method: 'post',
    data
  })
}

export function gonggaoTypeUpdate(data) {
  return request({
    url: url + '/gonggaoType/save',
    method: 'post',
    data
  })
}
