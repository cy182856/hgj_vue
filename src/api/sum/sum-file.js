import request from '@/utils/request'
import { url } from '@/utils/url'

export function sumFileList(query) {
  return request({
    url: url + '/sum/file/list',
    method: 'get',
    params: query
  })
}

export function sumFileSelect(id) {
  return request({
    url: url + '/sum/file/select',
    method: 'get',
    params: { id }
  })
}

export function deleteSumFile(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/sum/file/delete',
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

export function saveSumFile(data) {
  return request({
    url: url + '/sum/file/save',
    method: 'post',
    data
  })
}

export function updateSumFile(data) {
  return request({
    url: url + '/sum/file/save',
    method: 'post',
    data
  })
}
