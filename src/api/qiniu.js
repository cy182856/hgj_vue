import request from '@/utils/request'
import { url } from '@/utils/url'

export function getToken() {
  console.log("----------------------------")
  return request({
    url: '/user/getToken', // 假地址 自行替换
    method: 'get'
  })
}
