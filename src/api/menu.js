import request from '@/utils/request.js'

export function getMenuList() {
  return request({
    url: 'menus',
    method: 'get',
  })
}
