import request from '@/utils/request.js'

export function getReportData() {
  return request({
    url: 'reports/type/1',
    method: 'get',
  })
}
