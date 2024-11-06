import request from '@/utils/request'
import { url } from '@/utils/url'

export function cardCstBatch(cardCode) {
  return request({
    url: url + '/cardCstBatch/select',
    method: 'get',
    params: { cardCode }
  })
}



