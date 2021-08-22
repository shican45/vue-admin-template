<template>
  <div>
    <div>
      <div style="float:left;margin-left:270px;">
        <div style="float:left;margin:34px 15px 0px 0px;">
          <span>姓名:</span>
        </div>
        <div style="float:left;margin-top:25px;">
          <el-input v-model="searchObj.name" style="width:300px;" placeholder="" />
        </div>
      </div>

      <div style="float:left;margin-left:300px;">
        <div style="float:left;margin-top:25px;">
          <el-button type="primary" icon="el-icon-search" @click="search(searchObj.name)">查询</el-button>
        </div>
        <div style="float:left;margin:25px 0px 0px 20px;color:#409EFF;font-size:50%;">
          <a href="#/student/table">高级搜索</a>
        </div>
      </div>
    </div>
    <div style="clear:both; height:10px;" />
    <el-divider />
    <div style="widyh: 100%">
      <el-button type="primary" style="margin-left: 270px;width:100px;height:43px;" @click="title = '添加学生信息';dialogFormVisible = true">增加</el-button>
      <el-button type="danger" style="width:100px;height:43px;" @click="deleteList">删除</el-button>
    </div>
    <div style="clear:both; height:10px;" />
    <div style="width: 830px">
      <el-table
        v-cloak
        ref="multipleTable"
        :data="list"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%;margin: 0px 270px;"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="sex"
          label="性别"
          width="180"
        />
        <el-table-column
          prop="birthday"
          label="生日"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="singleDel(scope.$index)"
            >删除</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="edit(scope.$index)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--<div>
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
          <td style=""><input v-model="checkedArr" :value="item.id" type="checkbox"></td>
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.sex }}</td>
          <td>{{ item.birthday }}</td>
          <td><div style="color:#409EFF;"><a href="javascript:;" style="margin-right:10%;" @click="singleDel(item.id)">删除</a>
            <a href="javascript:;" style="margin-left:10%;" @click="edit(index)">编辑</a></div></td>
        </tr>
      </table>
    </div>-->
    <!--<td>{{ item.id+1 }}</td>-->

    <!--<div style="clear:both; height:10px;"></div>  更换对齐方式 上下和左右互换时-->
    <MyDialog :dialog-form-visible="dialogFormVisible" :title="title" @backBtn="back " @resetForm="resetForm" @submitBtn="edited?editCheck('form'):submitBtn('form')">

      <template #contents>
        <!--  #contents是简写方式，也可以写成v-slot:contents，还可以使用作用域
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

import MyDialog from '@/components/MyDialog/index.vue'
import { getStus } from '@/api/student'
import { searchStus } from '@/api/student'
import { delStus } from '@/api/student'
import { editStu } from '@/api/student'
import { addStus } from '@/api/student'

export default {
  components: { MyDialog },
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      title: '父组件标题',
      checkedArr: [],
      checkedItemArr: [],
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
  },
  methods: {
    getData() {
      this.listLoading = true
      getStus().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.checkedItemArr = val
      // 选中时，就已执行 this.$refs.multipleTable.toggleRowSelection(val)总的
      // this.$refs.multipleTable.selection 单击一行的行数据
    },
    search(searchName) {
      if (searchName === '') {
        this.getData()
      } else {
        this.listLoading = true
        searchStus(this.searchObj).then(response => {
          this.list = response.data.items
          this.listLoading = false
        })
      }
    },
    singleDel(itemIndex) {
      this.checkedArr[0] = this.list[itemIndex].id
      this.$confirm('确定删除?', '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        delStus(this.checkedArr).then(response => {
          this.list = response.data.items
        })
        this.checkedArr = []
      })
    },
    deleteList() {
      for (let i = 0; i < this.checkedItemArr.length; i++) {
        this.checkedArr[i] = this.checkedItemArr[i].id
      }
      this.checkedArr.sort
      if (this.checkedArr.length > 0) {
        this.$confirm('确定删除?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          delStus(this.checkedArr).then(response => {
            this.list = response.data.items
          })
          this.checkedArr = []
          this.$refs.multipleTable.clearSelection()
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      } else {
        this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      }
    },
    edit(index) {
      this.edited = true
      this.editedIndex = index
      this.title = '编辑学生信息'
      this.form.id = this.list[index].id
      this.form.name = this.list[index].name
      this.form.sex = this.list[index].sex
      this.form.birthday = this.list[index].birthday
      // this.$nextTick(() => {}) 下次Dom更新
      this.dialogFormVisible = true
    },
    editCheck(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editObj.index = this.editedIndex
          this.editObj.stu = this.form
          console.log(this.editObj.stu.birthday)
          // alert(this.form.birthday)
          editStu(this.editObj).then(response => {
            this.list = response.data.items
            this.addCheckLoading = false
          })
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
          this.addCheckLoading = false
          return false
        }
      })
      this.edited = false
    },
    submitBtn(formName) {
      this.addCheckLoading = true
      this.timer = setInterval(this.checked, 500, formName)
    },
    checked(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!')
          this.obj = this.form
          this.obj.id = this.list[this.list.length - 1].id + 1
          // alert(this.form.birthday)
          addStus(this.obj).then(response => {
            this.list = response.data.items
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
      if (this.edited === true) {
        this.edited === false
      }
      this.dialogFormVisible = b
    },
    resetForm() {
    }
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

