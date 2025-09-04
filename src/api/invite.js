import http from '@/api/instance.js'

export  const getQRCode = () => {
  return http.post('/invite/qrcode')
}

export const writeOff = () => {
  return http.post('/invite/writeOff')
}
export const check = (pid) => {
  return http.get(`/invite/check?pid=${pid}`)
}
