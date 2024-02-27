import request from '@/utils/request'
import { url } from '@/utils/url'

export function roleList(query) {
  return request({
    url: url + '/role/list',
    method: 'get',
    params: query
  })
}

export function roleSelect() {
  return request({
    url: url + '/role/select',
    method: 'get'
  })
}

export function deleteRole(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/role/delete',
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

export function saveRole(data) {
  return request({
    url: url + '/role/save',
    method: 'post',
    data
  })
}

export function saveRoleMenu(data) {
  return request({
    url: url + '/role/saveRoleMenu',
    method: 'post',
    data
  })
}


export function updateRole(data) {
  return request({
    url: url + '/role/save',
    method: 'post',
    data
  })
}
