import request from '@/utils/request.js'
import { method } from 'lodash'

export function getUserList(queryInfo) {
  return request({
    url: 'users',
    method: 'get',
    params: queryInfo,
  })
}

export function handleUserStateChange(uId, type) {
  return request({
    url: `users/${uId}/state/${type}`,
    method: 'put',
  })
}

export function handleAddUser(addForm) {
  return request({
    url: 'users',
    method: 'post',
    data: addForm,
  })
}

export function handleDeleteUser(uId) {
  return request({
    url: `users/${uId}`,
    method: 'delete',
  })
}

export function getUserInfo(uId) {
  return request({
    url: `users/${uId}`,
    method: 'get',
  })
}

export function handleEditUser(uId, editForm) {
  return request({
    url: `users/${uId}`,
    method: 'put',
    data: editForm,
  })
}

export function handleSetUserRole(uId, rId) {
  return request({
    url: `users/${uId}/role`,
    method: 'put',
    data: rId,
  })
}
