import request from '../utils/request'

export function getOptionalListByCateId(cateId) {
  return request({
    url: `/component/getOptionalListByCateId/${cateId}`,
    method: 'get'
  })
}

export function getOptionalListBySelected(data) {
  return request({
    url: `/component/getOptionalListBySelected`,
    method: 'post',
    data
  })
}
