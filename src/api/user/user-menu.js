import request from '@/utils/request'
import { url } from '@/utils/url'

//这里加一个，根据data的不同，后台会返回不同的字符串结果，动态菜单完成
export function authMenu(token) {
  return request({
    url: url + '/menu/load',
    method: 'get',
    params: { token }
  })
}

export function userMenuList(query) {
  return request({
    url: url + '/menu/list',
    method: 'get',
    params: query
  })
}

export function selectMenu(query) {
  return request({
    url: url + '/menu/selectMenu',
    method: 'get',
    params: query
  })
}

export function selectMenuMini(query) {
  return request({
    url: url + '/menu/selectMenuMini',
    method: 'get',
    params: query
  })
}