import request from '@/utils/request'
import { url } from '@/utils/url'

export function userList(query) {
  return request({
    url: url + '/user/list',
    method: 'get',
    params: query
  })
}

export function deptSelect() {
  return request({
    url: url + '/user/deptSelect',
    method: 'get'
  })
}

export function userSyncOfw() {
  return request({
    url: url + '/user/sync/ofw',
    method: 'get'
  })
}

export function userSync() {
  return request({
    url: url + '/user/sync',
    method: 'get'
  })
}

export function deleteStudent(id) {
  console.log("id-----------------"+id)
  return request({
    url: url + '/user/delete',
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

export function saveUser(data) {
  return request({
    url: url + '/user/save',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: url + '/user/updatePassword',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  console.log(data.name)
  return request({
    url: url + '/user/update',
    method: 'post',
    data
  })
}
