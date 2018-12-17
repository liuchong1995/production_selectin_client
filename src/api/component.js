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

export function getComponent(compId) {
  return request({
    url: `/component/${compId}`,
    method: 'get'
  })
}

export function getComponentByLastCate(cateId) {
  return request({
    url: `/component/findComponents/${cateId}`,
    method: 'get'
  })
}

export function hasAttachment(data) {
  return request({
    url: `/component/hasAttachment`,
    method: 'post',
    data
  })
}

export function search(data) {
  return request({
    url: `/component/search`,
    method: 'post',
    data
  })
}

export function deleteOrRecovery(compId) {
  return request({
    url: `/component/deleteOrRecovery/${compId}`,
    method: 'delete',
  })
}

export function isExit(data) {
  return request({
    url: `/component/isExit`,
    method: 'post',
    data
  })
}

export function addComp(data) {
  return request({
    url: `/component/insert`,
    method: 'post',
    data
  })
}

export function updateComponent(data) {
  return request({
    url: `/component/update/${data.compId}`,
    method: 'post',
    data: data.updateRequest
  })
}

export function getComponentToShow(compId) {
  return request({
    url: `/component/getComponentToShow/${compId}`,
    method: 'get'
  })
}

const uploadUrl = process.env.NODE_ENV === 'production' ? '/photo/wangEditorUpload' : 'http://localhost:8888/photo/wangEditorUpload'
const compImgUploadUrl = process.env.NODE_ENV === 'production' ? '/component/uploadFile' : 'http://localhost:8888/component/uploadFile'

export {uploadUrl,compImgUploadUrl}
