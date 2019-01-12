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

export function addShelfConstraint(data) {
  return request({
    url: `/constraint/shelfConstraint/`,
    method: 'post',
    data
  })
}

export function addAdvanceMandatory(data) {
  return request({
    url: `/constraint/advanceMandatory/`,
    method: 'post',
    data
  })
}

export function insertConstraint(data) {
  return request({
    url: `/constraint/`,
    method: 'post',
    data
  })
}

export function getMaxGroupId() {
  return request({
    url: `/constraint/maxGroupId`,
    method: 'get',
  })
}
