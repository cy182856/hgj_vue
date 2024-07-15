import request from '@/utils/request'
import { url } from '@/utils/url'

export function advertsList(query) {
  return request({
    url: url + '/adverts/list',
    method: 'get',
    params: query
  })
}

export function advertsIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/adverts/isShow',
    method: 'get',
    params: { id }
  })
}

export function advertsNotIsShow(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/adverts/notIsShow',
    method: 'get',
    params: { id }
  })
}

export function advertsDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/adverts/delete',
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

export function advertsSave(data) {
  return request({
    url: url + '/adverts/save',
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
