import request from '@/utils/request'
import { url } from '@/utils/url'

export function archiveStoreyList(query) {
  return request({
    url: url + '/archive/storey/list',
    method: 'get',
    params: query
  })
}

export function archiveStoreySelect() {
  return request({
    url: url + '/archive/storey/select',
    method: 'get'
  })
}

export function deleteArchiveStorey(id) {
  return request({
    url: url + '/archive/storey/delete',
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

export function saveArchiveStorey(data) {
  return request({
    url: url + '/archive/storey/save',
    method: 'post',
    data
  })
}

export function updateArchiveStorey(data) {
  return request({
    url: url + '/archive/storey/save',
    method: 'post',
    data
  })
}
