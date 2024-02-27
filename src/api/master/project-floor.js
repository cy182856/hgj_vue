import request from '@/utils/request'
import { url } from '@/utils/url'

export function projectFloorList(query) {
  return request({
    url: url + '/project/floor/list',
    method: 'get',
    params: query
  })
}

export function projectFloorSelect() {
  return request({
    url: url + '/project/floor/select',
    method: 'get'
  })
}


export function deleteProjectFloor(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/project/floor/delete',
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

export function saveProjectFloor(data) {
  return request({
    url: url + '/project/floor/save',
    method: 'post',
    data
  })
}

export function updateProjectFloor(data) {
  return request({
    url: url + '/project/floor/save',
    method: 'post',
    data
  })
}
