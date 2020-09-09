import request from '@/utils/request.js'

export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get',
  })
}

export function handleAddRoles(addForm) {
  return request({
    url: 'roles',
    method: 'post',
    data: addForm,
  })
}

export function getUserInfo(rId) {
  return request({
    url: `roles/${rId}`,
    method: 'get',
  })
}

export function handleEditRoles(rId, editForm) {
  return request({
    url: `roles/${rId}`,
    method: 'put',
    data: editForm,
  })
}

export function handleDeleteRoles(rId) {
  return request({
    url: `roles/${rId}`,
    method: 'delete',
  })
}

export function handleDeleteRoleRight(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete',
  })
}

export function getRightsList() {
  return request({
    url: 'rights/tree',
    method: 'get',
  })
}

export function handleSetRights(roleId, data) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data,
  })
}
