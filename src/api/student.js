/*
 * @Author: your name
 * @Date: 2021-08-16 13:28:47
 * @LastEditTime: 2021-08-20 20:07:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template\src\api\student.js
 */
import request from '@/utils/request'

export function getStus(params) {
  return request({
    url: '/vue-admin-template/student/stus',
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
}

export function delStus(data) {
  return request({
    url: '/vue-admin-template/student/delete',
    method: 'post',
    data
  })
}

export function editStu(data) {
  return request({
    url: '/vue-admin-template/student/editStu',
    method: 'post',
    data
  })
}

export function addStus(data) {
  return request({
    url: '/vue-admin-template/student/add',
    method: 'post',
    data
  })
}
