import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }

// 定义公用路径
const teacherPath = '/eduservice/teacher'
export default {
  // current为当前页 ，limit 是显示页数，teacherQuery 是查询条件
  getTeacherList(current, limit, teacherQuery) {
    return request({
      // 这边用的是 ES6的模板字符串写法 ``
      url: `${teacherPath}/pageTeacher/${current}/${limit}`,
      method: 'post',
      // data 表示把对象转为json传到接口里面， 注意格式 data:teacheQuery
      data: teacherQuery
    })
  },
  // 删除教师方法
  delTeacher(id) {
    return request({
      // 这边用的是 ES6的模板字符串写法 ``
      url: `${teacherPath}/deleteById/${id}`,
      method: 'delete'
    })
  },
  // 添加教师
  addTeacher(teacher) {
    return request({
      // 这边用的是 ES6的模板字符串写法 ``
      url: `${teacherPath}/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 根据教师id查询教师
  teacherById(id) {
    return request({
      // 这边用的是 ES6的模板字符串写法 ``
      url: `${teacherPath}/findTeacher/${id}`,
      method: 'get'
      // data:teacher
    })
  },
  // 修改教师
  updateTeacher(teacher) {
    return request({
      // 这边用的是 ES6的模板字符串写法 ``
      url: `${teacherPath}/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}
