import http from '@/api/instance.js'

export const clearUserInfo = () => {

};

export const logout = () => {
  return http.post('/user/logout');
};

export const login = (data) => {
  return http.post('/user/login', data)
}

export const getProfile = () => {
  return http.get('/user/profile')
}

export const updateProfile = (data) => {
  return http.post('/user/update', data)
}

export const register = (data) => {
  return http.post('/user/register', data)
}

export  const getAddCountQRCode = () => {
  return http.get('/user/addCountQRCode')
}

export const addCountCheck = (qid) => {
  return http.get(`/user/addCountCheck?qid=${qid}`)
}
export  const getBindQRCode = () => {
  return http.get('/user/bindQRCode')
}

export const bindCheck = (qid) => {
  return http.get(`/user/bindCheck?qid=${qid}`)
}

export const bind = (data) => {
  return http.post('/user/bind', data)
}
export const unbind = () => {
  return http.post('/user/unbind')
}
export const addCount = (data) => {
  return http.post('/user/addCount', data)
}
export const getUserInfoByQid = (qid) => {
  return http.get(`/user/qid?qid=${qid}`)
}
