import request from '@/request'

export function login(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function changePassword(account, password,mobilePhoneNumber,verifyNumber) {
  const data = {
    account,
    password,
    mobilePhoneNumber,
    verifyNumber
  }
  return request({
    url: '/login/changePassword',
    method: 'post',
    data
  })
}
export function getVerifyNumber(mobilePhoneNumber) {
  const data = {
    mobilePhoneNumber,
  }
  return request({
    url: '/login/getVerifyNumber',
    method: 'post',
    data
  })
}


export function logout(token) {
  return request({
    headers: {'Authorization': token},
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    headers: {'Authorization': token},
    url: '/users/currentUser',
    method: 'get'
  })
}

export function register(account, nickname, password,inviteCode,mobilePhoneNumber,verifyNumber) {
  const data = {
    account,
    nickname,
    password,
    inviteCode,
    mobilePhoneNumber,
    verifyNumber
  }
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
//更新头像
//todo 服务器是否支持patch请求，如何实现
export function updateAvatarToDb(filePath,token) {
  return request({
    headers: {'Authorization': token},
    url: `/users/updateAvatar`,
    method: 'post',
    data:filePath
  })
}
