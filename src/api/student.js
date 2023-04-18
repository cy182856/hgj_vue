import request from '@/utils/request'
import { url } from '@/store/store'

export function fetchList(query) {
  console.log("query---------------" + query.limit)
  return request({
    url: url + '/test/list',
    method: 'get',
    params: query
  })
}

export function deleteStudent(id) {
  console.log("id-----------------"+id)
  return request({
    url: url + '/test/delete',
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

export function createArticle(data) {
  return request({
    url: url + '/test/save',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  console.log(data.name)
  return request({
    url: url + '/test/save',
    method: 'post',
    data
  })
}
