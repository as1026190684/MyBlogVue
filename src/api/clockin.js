import request from '@/request'


export function getAllClockIn() {
  return request({
    url: `/clockIn/getAllClockIn`,
    method: 'get',
  })
}

export function pushClockInContent(content,token) {
  const data = {
    content,
    token
  }
  return request({
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/save',
    method: 'post',
    data
  })
}

export function getIndividualClockIn(token) {
  return request({
    headers: {'Authorization': token},
    url: '/clockIn/getIndividualClockIn',
    method: 'get',
  })
}

export function getOneDayPlan(token,oneDayTime) {
  const data = {
    token,
    oneDayTime
  }
  return request({
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/getOneDayPlan',
    method: 'post',
    data
  })
}
export function putPlanToRedis(content,token) {
  const data = {
    content,
    token
  }
  return request({
    headers: {'Authorization': token,'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/putPlanToRedis',
    method: 'post',
    data
  })
}

export function queryPlanCache(token) {
  return request({
    headers: {'Authorization': token,'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/queryPlanCache',
    method: 'get',
  })
}

export function withdrawTodayClockIn(clockInId,createDate,token) {
  const data= {
    clockInId,
    createDate
  };
  return request({
    headers: {'Authorization': token},
      url: '/clockIn/withdrawTodayClockIn',
    method: 'post',
    data
  })
}
export function getAllUserTheMonthClockInCounts(monthStart,monthEnd) {
  return request({
    url: `/clockIn/getAllUserTheMonthClockInCounts`,
    method: 'get',
    params:{
      monthStart: monthStart,
      monthEnd: monthEnd
    }
  })
}
export function getCurrentMonthAllUserClockInCounts() {
  return request({
    url: `/clockIn/getCurrentMonthAllUserClockInCounts`,
    method: 'get',
  })
}
export function getOneDayStudyRecords(token,oneDayTime) {
  const data = {
    token,
    oneDayTime
  }
  return request({
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/getOneDayStudyRecords',
    method: 'post',
    data
  })
}
export function getMonthsStudyRecords(token,months) {
  const data = {
    token,
    months
  }
  return request({
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    url: '/clockIn/getMonthsStudyRecords',
    method: 'post',
    data
  })
}
