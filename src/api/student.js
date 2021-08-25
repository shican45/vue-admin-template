import request from '@/utils/request'

const STUDENT_URL = '/vue-admin-template/v1/student'

export function getLimitedStus(page, limit) {
  return request({
    url: `${STUDENT_URL}/${page}/${limit}`,
    method: 'post'
  })
}

export function delStus(data) {
  return request({
    url: STUDENT_URL,
    method: 'delete',
    data
  })
}

export function editStu(data) {
  return request({
    url: STUDENT_URL,
    method: 'patch',
    data
  })
}

export function searchLimitedStus(searchName, page, limit) {
  return request({
    url: `${STUDENT_URL}/name/${page}/${limit}`,
    method: 'post',
    data: searchName
  })
}

export function addStus(data) {
  return request({
    url: STUDENT_URL,
    method: 'post',
    data
  })
}

/* export function getStus(params) {
  return request({
    url: STUDENT_URL + '/all',
    method: 'get',
    params
  })
}

export function searchStus(data) {
  return request({
    url: '/vue-admin-template/student/findStus',
    method: 'post',
    data
  })
}*/

