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

export function getCategory(cateId) {
  return request({
    url: `/category/${cateId}`,
    method: 'get'
  })
}

export function refactorCategoryMenu(data) {
  return request({
    url: `/category/refactor`,
    method: 'post',
    data
  })
}
