import request from '@/utils/request'
import { url } from '@/utils/url'

export function tagList(query) {
  return request({
    url: url + '/tag/list',
    method: 'get',
    params: query
  })
}

export function tagSelect() {
  return request({
    url: url + '/tag/select',
    method: 'get'
  })
}

export function tagDelete(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/tag/delete',
    method: 'get',
    params: { id }
  })
}

export function tagSave(data) {
  return request({
    url: url + '/tag/save',
    method: 'post',
    data
  })
}

export function tagUpdate(data) {
  return request({
    url: url + '/tag/save',
    method: 'post',
    data
  })
}

export function selectCstTree(query) {
  return request({
    url: url + '/tag/selectCstTree',
    method: 'get',
    params: query
  })
}

export function saveTagCst(data) {
  return request({
    url: url + '/tag/saveTagCst',
    method: 'post',
    data
  })
}
