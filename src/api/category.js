import request from '../utils/request'

export function getMenuTree(prdId,parentId) {
  return request({
    url: '/category/menu',
    method: 'get',
    params: {
      prdId,
      parentId
    }
  })
}
