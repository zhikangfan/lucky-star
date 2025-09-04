import http from '@/api/instance.js'

export  const getQRCode = () => {
  return http.get('/invite/qrcode')
}

export const writeOff = (data) => {
  return http.post('/invite/writeOff', data)
}
export const check = (qid) => {
  return http.get(`/invite/check?qid=${qid}`)
}
