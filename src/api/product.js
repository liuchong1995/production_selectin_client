import request from '../utils/request';
export function fetchList(query) {
  return request({
    url: '/product/all',
    method: 'get',
    params: query
  })
}

export function fetchOne(prdId) {
  return request({
    url: `/product/${prdId}`,
    method: 'get'
  })
}

export function deleteOne(prdId) {
  return request({
    url: `/product/${prdId}`,
    method: 'delete'
  })
}

export function canBeDelete(prdId) {
  return request({
    url: `/product/canBeDelete/${prdId}`,
    method: 'get'
  })
}

export function addProduct(data) {
  return request({
    url: `/product/`,
    method: 'post',
    data
  })
}
