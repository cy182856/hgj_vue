import request from '@/utils/request'
import { url } from '@/utils/url'

export function cstMeterList(query) {
  return request({
    url: url + '/cst/meter/list',
    method: 'get',
    params: query
  })
}

export function saveCstMeter(data) {
  return request({
    url: url + '/cst/meter/save',
    method: 'post',
    data
  })
}

export function deleteCstMeter(id) {
  console.log("------------ID-----------"+id)
  return request({
    url: url + '/cst/meter/delete',
    method: 'get',
    params: { id }
  })
}

