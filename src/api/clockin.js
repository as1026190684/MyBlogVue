import request from '@/request'


export function getClockInByArticle(id) {
  return request({
    url: `/comments/article/${id}`,
    method: 'get'
  })
}

export function publishComment(comment,token) {
  return request({
    headers: {'Authorization': token},
    url: '/comments/create/change',
    method: 'post',
    data: comment
  })
}
