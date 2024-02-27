import request from '@/utils/request'
import { url } from '@/utils/url'

export function archiveBoxList(query) {
  return request({
    url: url + '/archive/box/list',
    method: 'get',
    params: query
  })
}

export function archiveBoxSelect() {
  return request({
    url: url + '/archive/box/select',
    method: 'get'
  })
}

export function deleteArchiveBox(id) {
  return request({
    url: url + '/archive/box/delete',
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

export function saveArchiveBox(data) {
  return request({
    url: url + '/archive/box/save',
    method: 'post',
    data
  })
}

export function updateArchiveBox(data) {
  return request({
    url: url + '/archive/box/save',
    method: 'post',
    data
  })
}
