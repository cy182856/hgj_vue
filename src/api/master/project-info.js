import request from '@/utils/request'
import { url } from '@/utils/url'

export function projectInfoList(query) {
  return request({
    url: url + '/project/info/list',
    method: 'get',
    params: query
  })
}

export function projectInfoSelect() {
  return request({
    url: url + '/project/info/select',
    method: 'get',
  })
}

export function deleteProjectInfo(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/project/info/delete',
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

export function saveProjectInfo(data) {
  return request({
    url: url + '/project/info/save',
    method: 'post',
    data
  })
}

export function updateProjectInfo(data) {
  return request({
    url: url + '/project/info/save',
    method: 'post',
    data
  })
}
