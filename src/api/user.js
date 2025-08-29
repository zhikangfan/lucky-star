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
