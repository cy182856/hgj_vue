import request from '@/utils/request'
import { url } from '@/utils/url'

export function advertsPathList(query) {
  return request({
    url: url + '/advertsPath/list',
    method: 'get',
    params: query
  })
}

export function advertsPathSelect() {
  return request({
    url: url + '/advertsPath/select',
    method: 'get'
  })
}

export function advertsPathDelete(id) {
  return request({
    url: url + '/advertsPath/delete',
    method: 'get',
    params: { id }
  })
}

export function advertsPathSave(data) {
  return request({
    url: url + '/advertsPath/save',
    method: 'post',
    data
  })
}


