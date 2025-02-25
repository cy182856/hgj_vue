import request from '@/utils/request'
import { url } from '@/utils/url'

export function userSendCode(userName) {
  return request({
    url: url + '/user/sendCode',
    method: 'get',
    params: { userName }
  })
}
