import request from '@/utils/request'
import { url } from '@/utils/url'

export function workTimeList(query) {
  return request({
    url: url + '/workTime/list',
    method: 'get',
    params: query
  })
}

export function workTimeUpdate(data) {
  return request({
    url: url + '/workTime/update',
    method: 'post',
    data
  })
}


