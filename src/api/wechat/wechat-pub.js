import request from '@/utils/request'
import { url } from '@/utils/url'

export function wechatPubList(query) {
  return request({
    url: url + '/wechatPub/list',
    method: 'get',
    params: query
  })
}

export function wechatPubMenuList(query) {
  return request({
    url: url + '/wechatPub/menuList',
    method: 'get',
    params: query
  })
}

export function wechatPubSave(data) {
  return request({
    url: url + '/wechatPub/save',
    method: 'post',
    data
  })
}

export function wechatPubMenuSave(data) {
  return request({
    url: url + '/wechatPub/menuSave',
    method: 'post',
    data
  })
}

export function wechatPubSelect() {
  return request({
    url: url + '/wechatPub/select',
    method: 'get'
  })
}

export function wechatPubMenuSelect() {
  return request({
    url: url + '/wechatPub/menuSelect',
    method: 'get'
  })
}

export function wechatPubAddUser(data) {
  return request({
    url: url + '/wechatPub/addUser',
    method: 'post',
    data
  })
}

export function wechatPubAddMenu(data) {
  return request({
    url: url + '/wechatPub/addMenu',
    method: 'post',
    data
  })
}

export function wechatPubMsgTempList(query) {
  return request({
    url: url + '/wechatPub/msgTempList',
    method: 'get',
    params: query
  })
}

export function closeMsg(id) {
  return request({
    url: url + '/wechatPub/closeMsg',
    method: 'get',
    params: { id }
  })
}

export function openMsg(id) {
  return request({
    url: url + '/wechatPub/openMsg',
    method: 'get',
    params: { id }
  })
}
