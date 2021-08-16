<template>
  <!--在此处添加渲染的内容-->
  <div>
    <div>
      <div style="float:left;">
        <div style="float:left;margin:28px 5px 0px 15px;">
          <span>姓名</span>
        </div>
        <div style="float:left;margin-top:25px;">
          <input v-model="searchObj.name" style="width:300px;" placeholder="">
        </div>
      </div>

      <div style="float:right;">
        <div style="float:right;margin:15px 20px;color:#409EFF;font-size:50%;">
          <a href="#/student/table">高级搜索</a>
        </div>
        <div style="float:right;margin-top:15px;">
          <el-button style="font-size:50%;width:150px;height:43px;" type="primary" @click="search(searchObj.name)">查询</el-button>
        </div>
      </div>
    </div>
    <div style="clear:both; height:10px;" />
    <hr style="margin-bottom:0px">
    <div>
      <el-button type="primary" style="width:100px;height:43px;" @click="title = '添加学生信息';dialogFormVisible = true">增加</el-button>
      <el-button type="danger" style="width:100px;height:43px;" @click="deleteList">删除</el-button>
    </div>
    <div style="clear:both; height:10px;" />
    <div>
      <table
        v-loading="listLoading"
        class="stu-table"
      >
        <tr>
          <th>选择</th>
          <th>序号</th>
          <th>姓名</th>
          <th>性别</th>
          <th>生日</th>
          <th style="width:23%">操作</th>
        </tr>
        <tr v-for="(item, index) of list" v-cloak :key="index">
          <!--<td>{{ item.id+1 }}</td>-->
          <td style=""><input v-model="checkedArr" :value="index" type="checkbox"></td>
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.sex }}</td>
          <td>{{ item.birthday }}</td>
          <td><div style="color:#409EFF;"><a href="javascript:;" style="margin-right:10%;" @click="singleDel(index)">删除</a>
            <a href="javascript:;" style="margin-left:10%;" @click="edit(index)">编辑</a></div></td>
        </tr>
      </table>
    </div>

    <!--<div style="clear:both; height:10px;"></div>  更换对齐方式 上下和左右互换时-->
    <MyDialog :dialog-form-visible="dialogFormVisible" :title="title" @backBtn="back" @submitBtn="edited?editCheck('form'):submitBtn('form')">
      //这种是简写方式，也可以写成v-slot:contents，还可以使用作用域
      <template #contents>
        <!--
        <label for="name">请输入姓名：</label><br>
        <input v-model="name" type="text" name="name"><br>
        <label for="sex">请输入性别：</label><br>
        <input v-model="sex" type="text" name="sex"><br><br>
        <label for="birthday">请输入生日：</label><br>
        <input v-model="birthday" type="text" name="birthday"><br><br>-->
        <el-form ref="form" v-loading="addCheckLoading" :model="form" status-icon :rules="rules">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth" prop="birthday">
            <el-col :span="11">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
    </MyDialog>

  </div>
</template>

<script type="text/ecmascript-6">

// find后再操作出错

// 问题一

// 多选删     是根据checkbox绑定的值
// (  id: 无法根据复选框状态传递index数组，全部数据时操作慢
//    index: 无法根据复选框状态传递id数组，再操作时无法对 全部的数据 有效操作)
// 单个方法(删、编辑)   的参数
// (  id: 全部数据时操作慢)
// (  index: 再操作时无法对 全部的数据 有效操作)

// 解决之一: data定义finedObj{fined:false,arr:[]}，如果fine操作或任何操作使得list 更新(未知，先改->)，finedObj.fined改为true，
//           .vue添加判断，使再操作的参数为根据list的index数组或单个index 获取的 id数组或单个id
//           mock中,config.body所赋值的 添加判断.fined ,再做不同操作，delete中已写好
// ---已在需要写的位置注释，待写

// 问题二

// (  点删除会让list数据刷新，表格数据显示全部，不能保持finedStatus
//    原因: 删除让list刷新，list在data的return中 表格v-for遍历list
//    为什么list刷新，v-for也刷新? | -> 可尝试利用props)
// ---待解决 未查原因，未尝试
import MyDialog from '@/components/MyDialog/index.vue'

import { getStus } from '@/api/student'
import { searchStus } from '@/api/student'
import { delStus } from '@/api/student'
import { editStu } from '@/api/student'
import { addStus } from '@/api/student'
// 将渲染的内容导出
export default {
  components: { MyDialog },
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      title: '父组件标题',
      checkedArr: [],
      list: [],
      listLoading: true,
      addCheckLoading: false,
      edited: false,
      editedIndex: 0,
      editObj: {
        index: 0,
        stu: []
      },
      // 表单校验速度太快，体现不出等待loading，所以加了个timer
      timer: null,
      searchObj: {
        name: ''
      },
      // name: '',
      // sex: '',
      // birthday: '',
      obj: {
        id: 0,
        name: '',
        sex: '',
        birthday: ''
      },
      form: {
        id: 0,
        name: '',
        sex: '',
        birthday: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ],
        birthday: [
          { required: true, message: '请选择日期(输入的日期格式应为：yyyy-MM-dd)' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getData()
    // console.log(Date.now())
    // this.setSlist(this.list)
  },
  methods: {
    getData() {
      this.listLoading = true
      getStus().then(response => {
        this.list = response.data.items
        this.listLoading = false
        //                                                  finedObj.fined改为false
      })
    },
    search(searchName) {
      if (searchName === '') {
        this.getData()
      } else {
        this.listLoading = true
        searchStus(this.searchObj).then(response => {
          this.list = response.data.items
          this.listLoading = false
        //                                                  finedObj.fined改为true
        })
      }
    },
    singleDel(index) {
      //                                             待判断是否根据list的index数组或单个index 获取的 id数组或单个id
      this.checkedArr[0] = index
      // console.log(this.checkedArr)
      delStus(this.checkedArr).then(response => {
        this.list = response.data.items
        //                                                  finedObj.fined改为false
      })
      this.checkedArr = []
    },
    deleteList() {
      // console.log(this.checkedArr)
      // console.log(this.list)
      //                                             待判断是否根据list的index数组或单个index 获取的 id数组或单个id
      delStus(this.checkedArr).then(response => {
        this.list = response.data.items
        //                                                  finedObj.fined改为false
      })
      this.checkedArr = []
    },
    edit(index) {
      this.edited = true
      this.editedIndex = index
      this.title = '编辑学生信息'
      this.form.name = this.list[index].name
      this.form.sex = this.list[index].sex
      this.form.birthday = this.list[index].birthday
      this.dialogFormVisible = true
    },
    editCheck(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!')
          //                                             待判断是否转换为id
          this.editObj.index = this.editedIndex
          this.editObj.stu = this.form
          // alert(this.form.birthday)
          editStu(this.editObj).then(response => {
            this.list = response.data.items
            //                                                  finedObj.fined改为false
            this.addCheckLoading = false
            // console.log(this.list)
          })
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
          this.addCheckLoading = false
          return false
        }
      })
    },
    /* update() {
      var that = this
      // console.log(this.obj)
      this.$axios
        .post('/vue-admin-template/student/update', {
          params: {
            obj: this.obj
          }
        })
        .then(function(res) {
        // console.log("请求的数据"+res.data.data);
          that.list = res.data.data
        })
    },*/
    submitBtn(formName) {
      // this.obj.name = this.name
      // this.obj.sex = this.sex
      // this.obj.birthday = this.birthday
      // console.log(this.obj)
      this.addCheckLoading = true
      // eslint-disable-next-line no-implied-eval
      this.timer = setInterval(this.checked, 500, formName)
    },
    checked(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!')
          this.obj = this.form
          // alert(this.form.birthday)
          addStus(this.obj).then(response => {
            this.list = response.data.items
            //                                                  finedObj.fined改为false
            this.addCheckLoading = false
            // console.log(this.list)
          })
          clearInterval(this.timer)
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
          clearInterval(this.timer)
          this.addCheckLoading = false
          return false
        }
      })
    },
    back(b) {
      this.dialogFormVisible = b
    }
    // 获取需要渲染到页面中的数据
    /* setSlist(arr) {
      this.slist = JSON.parse(JSON.stringify(arr))
    },*/
  }
}
</script>

<style type="text/css">
.el-button--goon:focus,
.el-button--goon:hover {
  background: #48D1CC;
  border-color: #48D1CC;
  color: #fff;
}

[v-cloak] {
  display: none
}

.stu-table {
  border: 1px solid rgb(31, 28, 28);
  padding: 0;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: -10px;
  width: 70%;
}
.stu-table td,
.stu-table th {
  height: 30px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 15px;
  font-weight: 400;
  padding: 3px 3px 3px 8px;
  text-align: center
}
</style>

