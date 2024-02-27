import request from '@/utils/request'
import { url } from '@/utils/url'

export function fileSecLevelList(query) {
  return request({
    url: url + '/file/sec/level/list',
    method: 'get',
    params: query
  })
}

export function fileSecLevelSelect() {
  return request({
    url: url + '/file/sec/level/select',
    method: 'get'
  })
}

export function deleteFileSecLevel(id) {
  return request({
    url: url + '/file/sec/level/delete',
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

export function saveFileSecLevel(data) {
  return request({
    url: url + '/file/sec/level/save',
    method: 'post',
    data
  })
}

export function updateFileSecLevel(data) {
  return request({
    url: url + '/file/sec/level/save',
    method: 'post',
    data
  })
}
