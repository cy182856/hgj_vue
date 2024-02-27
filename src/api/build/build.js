import request from '@/utils/request'
import { url } from '@/utils/url'


export function budSelect(projectNum,mobile) {
  return request({
    url: url + '/build/select',
    method: 'get',
    params: { projectNum,mobile }
  })
}
