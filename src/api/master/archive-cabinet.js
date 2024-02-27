import request from '@/utils/request'
import { url } from '@/utils/url'

export function archiveCabinetList(query) {
  return request({
    url: url + '/archive/cabinet/list',
    method: 'get',
    params: query
  })
}

export function archiveCabinetSelect() {
  return request({
    url: url + '/archive/cabinet/select',
    method: 'get'
  })
}


export function deleteArchiveCabinet(id) {
  return request({
    url: url + '/archive/cabinet/delete',
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

export function saveArchiveCabinet(data) {
  return request({
    url: url + '/archive/cabinet/save',
    method: 'post',
    data
  })
}

export function updateArchiveCabinet(data) {
  return request({
    url: url + '/archive/cabinet/save',
    method: 'post',
    data
  })
}
