import request from '../utils/request'

export function getMenuTree(prdId, parentId) {
  return request({
    url: '/category/menu',
    method: 'get',
    params: {
      prdId,
      parentId
    }
  })
}

export function getAllMenuTree(prdId, parentId) {
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

export function getOneLevelCategory(query) {
  return request({
    url: `/category/oneLevel`,
    method: 'get',
    params: {
      productId: query.productId,
      parentId: query.parentId
    }
  })
}

export function addCategory(data) {
  return request({
    url: `/category/add`,
    method: 'post',
    data
  })
}

export function delCategory(data) {
  return request({
    url: `/category/delete`,
    method: 'post',
    data
  })
}

export function rename(data) {
  return request({
    url: `/category/rename`,
    method: 'post',
    params: {
      categoryName: data.categoryName,
      categoryId: data.categoryId
    }
  })
}
