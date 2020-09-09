import request from '@/utils/request.js'

export function getOrdersList(queryInfo) {
  return request({
    url: 'orders',
    method: 'get',
    params: queryInfo,
  })
}

export function checkGoodsProgress() {
  return request({
    url: `kuaidi/1106975712662`,
    method: 'get',
  })
}
