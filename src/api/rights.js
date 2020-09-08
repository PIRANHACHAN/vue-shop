import request from '@/utils/request.js'

export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get',
  })
}
