const Mock = require('mockjs')

var data = Mock.mock({
  'items|5': [{
    'id|+1': 0,
    name: '@cname',
    'sex|1': ['男', '女'],
    birthday: '2000-01-01'
  }]
}) // 存放学生数据的数组

module.exports = [
  {
    url: '/vue-admin-template/student/stus',
    type: 'get',
    response: config => {
      var items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/findStus',
    type: 'post',
    response: config => {
      var searchObj = config.body
      var result = data.items.filter(stu => {
        // console.log(searchObj.name)
        if (stu.name.indexOf(searchObj.name) === -1) return false
        return true
      })
      /* for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].name.indexOf(searchStr) !== -1) {
          result.push(data.items[i])
        }
      }*/
      return {
        code: 20000,
        data: {
          items: result
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/delete',
    type: 'post',
    response: config => {
      var params = config.body
      params.sort()
      // params.arr.sort()
      // 查询后的删除根据id删除数据 否则根据下标删除数据
      /* if (params.fined) {
        for (let i = 0; i < data.items.length; i++) {
          for (let j = 0; j < params.arr.length; j++) {
            if (params.arr[j].id === data.items[i].id) {
              data.items.splice(i, 1)
            }
          }
        }
      } else {
        for (let i = params.Arr.length - 1; i >= 0; i--) {
          data.items.splice(params.Arr[i], 1)
        }
      }*/
      for (let i = params.length - 1; i >= 0; i--) {
        data.items.splice(params[i], 1)
      }
      return {
        code: 20000,
        data: {
          items: data.items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/editStu',
    type: 'post',
    response: config => {
      var params = config.body
      data.items[params.index].name = params.stu.name
      data.items[params.index].sex = params.stu.sex
      data.items[params.index].birthday = params.stu.birthday
      return {
        code: 20000,
        data: {
          items: data.items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/add',
    type: 'post',
    response: config => {
      var obj = config.body
      if (data.items.length === 0) {
        obj.id = 0
      } else {
        obj.id = data.items[data.items.length - 1].id + 1
      }
      // obj.birthday = obj.birthday.slice(0, 10)
      data.items = data.items.concat(obj)
      return {
        code: 20000,
        data: {
          items: data.items
        }
      }
    }
  }
]
/* const arr = []
for (let i = 0; i < 5; i++) {
  // eslint-disable-next-line prefer-const
  let stu = {
    id: i,
    name: '张三',
    sex: '男',
    birthday: '2000-01-01'
  }
  arr.push(stu)
}
// 数据的删除操作
// eslint-disable-next-line prefer-const
let list = function(options) {
  // console.log(options.type);
  const rtype = options.type.toLowerCase() // 获取请求的类型并转换为小写
  switch (rtype) {
    case 'get':
      break
    case 'post':
      // eslint-disable-next-line no-case-declarations
      const id = parseInt(JSON.parse(options.body).params.id) // 获取请求的id，将options.body转换为JSON对象
      arr = arr.filter(function(val) {
        // eslint-disable-next-line eqeqeq
        return val.id != id // 过滤掉前台传过来的id对应的相应数据，并重新返回
      })
      break
    default:
      break
  }
  return {
    data: arr
  }
}

Mock.mock('/list', /get|post/i, list)
*/
