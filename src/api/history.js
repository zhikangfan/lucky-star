import http from '@/api/instance.js'

export const getHistoryList = () => {
  return http.get('/history/list')
}

export const addHistory = (data) => {
  return http.post('/history/add', data)
}

export const writeOff = (data) => {
  return http.post('/history/writeOff', data)
}

export const getWriteOffQRCode = (hid) => {
  return http.get(`/history/writeOffQRCode?hid=${hid}`)
}
export const writeOffCheck = (qid) => {
  return http.get(`/history/writeOffCheck?qid=${qid}`)
}
