import request from '../utils/request';
export function getAllUsers(query) {
  return request({
    url: '/user/getAllUsers',
    method: 'get',
    params: query
  })
}
