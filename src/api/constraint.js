import request from '@/utils/request'

export function deleteConstraint(constraintId) {
  return request({
    url: `/constraint/${constraintId}`,
    method: 'delete'
  })
}

export function deleteConstraints(data) {
  return request({
    url: `/constraint/deleteAll`,
    method: 'post',
    data
  })
}

export function search(data) {
  return request({
    url: `/constraint/search`,
    method: 'post',
    data
  })
}
