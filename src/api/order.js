import request from '../utils/request'

export function generateModelNumber(data) {
  return request({
    url: `/order/modelNumber`,
    method: 'post',
    data
  })
}

export function getMandatoryResult(data) {
  return request({
    url: `/order/getMandatoryResult`,
    method: 'post',
    data
  })
}

export function saveOrder(data) {
  return request({
    url: `/order/add`,
    method: 'post',
    data
  })
}
