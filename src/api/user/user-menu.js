import request from '@/utils/request'
import { url } from '@/utils/url'

//这里加一个，根据data的不同，后台会返回不同的字符串结果，动态菜单完成
export function authMenu(token) {
  return request({
    url: url + '/user/menu',
    method: 'get',
    params: { token }
  })
}

export function userMenuList(query) {
  return request({
    url: url + '/user/menu/list',
    method: 'get',
    params: query
  })
}