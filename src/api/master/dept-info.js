import request from '@/utils/request'
import { url } from '@/utils/url'

export function deptInfoList(query) {
  return request({
    url: url + '/dept/info/list',
    method: 'get',
    params: query
  })
}

export function deptInfoSelect() {
  return request({
    url: url + '/dept/info/select',
    method: 'get'
  })
}

export function deleteDeptInfo(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/dept/info/delete',
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

export function saveDeptInfo(data) {
  return request({
    url: url + '/dept/info/save',
    method: 'post',
    data
  })
}

export function updateDeptInfo(data) {
  return request({
    url: url + '/dept/info/save',
    method: 'post',
    data
  })
}
