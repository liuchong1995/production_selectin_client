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

export function updateOrder(data) {
  return request({
    url: `/order/update`,
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url: '/order/list',
    method: 'post',
    data
  })
}

export function deleteOrder(orderId) {
  return request({
    url: `/order/${orderId}`,
    method: 'delete',
  })
}

export function getOrderDetail(orderId) {
  return request({
    url: `/order/orderDetail/${orderId}`,
    method: 'get',
  })
}

export function getOrder(orderId) {
  return request({
    url: `/order/${orderId}`,
    method: 'get',
  })
}
