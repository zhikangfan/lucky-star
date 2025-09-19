import http from '@/api/instance.js'
export const getPrizeList = () => {
  return http.get('/prize/list')
}
export const getAllPrizeList = () => {
  return http.get('/prize/listAll')
}
export const addPrize = (data) => {
  return http.post('/prize/add', data)
}

export const updatePrize = (data) => {
  return http.post('/prize/update', data)
}

export const removePrize = (data) => {
  return http.post('/prize/remove', data)
}
