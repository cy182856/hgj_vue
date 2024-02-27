import request from '@/utils/request'
import { url } from '@/utils/url'

export function companyList(query) {
  return request({
    url: url + '/company/list',
    method: 'get',
    params: query
  })
}

export function companySelect() {
  return request({
    url: url + '/company/select',
    method: 'get'
  })
}

export function deleteCompany(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/company/delete',
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

export function saveCompany(data) {
  return request({
    url: url + '/company/save',
    method: 'post',
    data
  })
}

export function updateCompany(data) {
  return request({
    url: url + '/company/save',
    method: 'post',
    data
  })
}
