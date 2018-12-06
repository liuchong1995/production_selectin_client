import request from '../utils/request'

export function getAllHeight(prdId) {
  return request({
    url: `/shelf/getAllHeight/${prdId}`,
    method: 'get'
  })
}

export function getAllMountHeight() {
  return request({
    url: `/shelf/getMountHeight/`,
    method: 'get'
  })
}

export function getShelfConstraint(prdId) {
  return request({
    url: `/shelf/getShelfConstraint/${prdId}`,
    method: 'get'
  })
}

export function getAllInstallation(prdId) {
  return request({
    url: `/shelf/getAllInstallation/${prdId}`,
    method: 'get'
  })
}
