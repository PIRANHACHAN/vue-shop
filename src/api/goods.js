import request from '@/utils/request.js'

export function getGoodsCateList(queryInfo) {
  return request({
    url: 'categories',
    method: 'get',
    params: queryInfo,
  })
}

export function handleAddGoodsCate(addCateForm) {
  return request({
    url: 'categories',
    method: 'post',
    data: addCateForm,
  })
}

export function getThisCateInfo(cateId) {
  return request({
    url: `categories/${cateId}`,
    method: 'get',
  })
}

export function handleEditGoodsCate(cateId, editCateForm) {
  return request({
    url: `categories/${cateId}`,
    method: 'put',
    data: editCateForm,
  })
}

export function handleDeleteGoodsCate(cateId) {
  return request({
    url: `categories/${cateId}`,
    method: 'delete',
  })
}

export function handleAddGoods(addForm) {
  return request({
    url: 'goods',
    method: 'post',
    data: addForm,
  })
}

export function getGoodsList(queryInfo) {
  return request({
    url: 'goods',
    method: 'get',
    params: queryInfo,
  })
}

export function handleDeleteGoods(goodId) {
  return request({
    url: `goods/${goodId}`,
    method: 'delete',
  })
}

export function getParamsData(selectedCateId, activeTabsName) {
  return request({
    url: `categories/${selectedCateId}/attributes`,
    method: 'get',
    params: activeTabsName,
  })
}

export function handleAddParams(selectedCateId, data) {
  return request({
    url: `categories/${selectedCateId}/attributes`,
    method: 'post',
    data,
  })
}

export function getEditParams(selectedCateId, attr_id, params) {
  return request({
    url: `categories/${selectedCateId}/attributes/${attr_id}`,
    method: 'get',
    params,
  })
}

export function handleEditParams(selectedCateId, attr_id, data) {
  return request({
    url: `categories/${selectedCateId}/attributes/${attr_id}`,
    method: 'put',
    data,
  })
}

export function handleDeleteParams(selectedCateId, attr_id) {
  return request({
    url: `categories/${selectedCateId}/attributes/${attr_id}`,
    method: 'delete',
  })
}

export function saveAttrVals(selectedCateId, attr_id, data) {
  return request({
    url: `categories/${selectedCateId}/attributes/${attr_id}`,
    method: 'put',
    data,
  })
}
