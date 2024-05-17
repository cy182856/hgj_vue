import request from '@/utils/request'
import { url } from '@/utils/url'

export function appletMenuList(query) {
  return request({
    url: url + '/applet/menu/list',
    method: 'get',
    params: query
  })
}

export function selectCstTree(query) {
  return request({
    url: url + '/applet/menu/selectCstTree',
    method: 'get',
    params: query
  })
}

export function saveAppletCstMenu(data) {
  return request({
    url: url + '/applet/menu/saveAppletCstMenu',
    method: 'post',
    data
  })
}
