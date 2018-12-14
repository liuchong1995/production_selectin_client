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
