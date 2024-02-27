import request from '@/utils/request'
import { url } from '@/utils/url'

export function projectUnitList(query) {
  return request({
    url: url + '/project/unit/list',
    method: 'get',
    params: query
  })
}

export function projectUnitSelect() {
  return request({
    url: url + '/project/unit/select',
    method: 'get'
  })
}

export function deleteProjectUnit(id) {
  return request({
    url: url + '/project/unit/delete',
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

export function saveProjectUnit(data) {
  return request({
    url: url + '/project/unit/save',
    method: 'post',
    data
  })
}

export function updateProjectUnit(data) {
  return request({
    url: url + '/project/unit/save',
    method: 'post',
    data
  })
}
