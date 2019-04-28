import request from '../utils/request'

export function getAllUsers(query) {
  return request({
    url: '/user/getAllUsers',
    method: 'get',
    params: query
  })
}

export function getAllRoles(query) {
  return request({
    url: '/user/roles',
    method: 'get',
    params: query
  })
}

export function searchUsers(query) {
  return request({
    url: '/user/search',
    method: 'get',
    params: {
      page: query.page,
      rows: query.limit
    }
  })
}

export function banOrDebanUser(userId) {
  return request({
    url: `/user/banOrDebanUser/${userId}`,
    method: 'post',
  })
}

export function updatePassword(data) {
  return request({
    url: `/user/updatePassword`,
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: `/user/`,
    method: 'post',
    data
  })
}

export function checkOldPassword(data) {
  return request({
    url: `/user/checkOldPassword`,
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
}

export function modifyPassword(data) {
  return request({
    url: `/user/modifyPassword`,
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
}


export function deleteUser(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'delete',
  })
}
