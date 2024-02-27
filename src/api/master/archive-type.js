import request from '@/utils/request'
import { url } from '@/utils/url'

export function archiveTypeList(query) {
  return request({
    url: url + '/archive/type/list',
    method: 'get',
    params: query
  })
}

export function archiveTypeSelect() {
  return request({
    url: url + '/archive/type/select',
    method: 'get'
  })
}

export function deleteArchiveType(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/archive/type/delete',
    method: 'get',
    params: { id }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function saveArchiveType(data) {
  return request({
    url: url + '/archive/type/save',
    method: 'post',
    data
  })
}

export function updateArchiveType(data) {
  return request({
    url: url + '/archive/type/save',
    method: 'post',
    data
  })
}
