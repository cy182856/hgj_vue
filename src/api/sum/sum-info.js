import request from '@/utils/request'
import { url } from '@/utils/url'

export function sumInfoList(query) {
  return request({
    url: url + '/sum/info/list',
    method: 'get',
    params: query
  })
}

export function deleteSumInfo(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/sum/info/delete',
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

export function saveSumInfo(data) {
  return request({
    url: url + '/sum/info/save',
    method: 'post',
    data
  })
}

export function updateSumInfo(data) {
  return request({
    url: url + '/sum/info/save',
    method: 'post',
    data
  })
}
