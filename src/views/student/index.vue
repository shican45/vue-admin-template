<template>
  <div>
    <div>
      <div style="float: left; margin-left: 270px;">
        <div style="float: left; margin: 34px 15px 0px 0px;">
          <span>姓名:</span>
        </div>
        <div style="float: left; margin-top: 25px;">
          <el-input v-model="searchObj.name" style="width: 300px;" placeholder="" />
        </div>
      </div>

      <div style="float: left; margin-left: 300px;">
        <div style="float: left; margin-top: 25px;">
          <el-button type="primary" icon="el-icon-search" @click="search(searchObj.name)">查询</el-button>
        </div>
        <div style="float: left; margin: 25px 0px 0px 20px; color: #409EFF; font-size: 50%;">
          <a href="#/student/table">高级搜索</a>
        </div>
      </div>
    </div>
    <div style="clear: both; height: 10px;" />
    <el-divider />
    <div style="widyh: 100%">
      <el-button type="primary" style="margin-left: 270px; width: 100px; height: 43px;" @click="title = '添加学生信息';dialogFormVisible = true">增加</el-button>
      <el-button type="danger" style="width: 100px; height: 43px;" @click="deleteList">删除</el-button>
    </div>
    <div style="clear: both; height: 10px;" />
    <div style="width: 830px;">
      <el-table
        v-cloak
        ref="multipleTable"
        :data="list"
        max-height="418"
        :row-style="{height:'50px'}"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%; margin: 0px 270px;"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{ scope.$index+(page - 1) * limit + 1 }} </span></template>
        </el-table-column>
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
      <div style="position: fixed; bottom: 40px">
        <el-pagination
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          style="padding: 30px 0; margin-left: 400px; text-align: center;"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize"
          @current-change="changeCurrentPage"
        />
      </div>
    </div>
    <MyDialog :dialog-form-visible="dialogFormVisible" :title="title" @backBtn="back " @resetForm="resetForm" @submitBtn="edited?editCheck('form'):submitBtn('form')">

      <template #contents>
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
import { delStus } from '@/api/student'
import { editStu } from '@/api/student'
import { addStus } from '@/api/student'
import { getLimitedStus } from '@/api/student'
import { searchLimitedStus } from '@/api/student'

export default {
  components: { MyDialog },
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      title: '父组件标题',
      checkedArr: [], // 表格中多选中的学生id数组
      checkedItemArr: [], // 表格中多选中的学生对象数组
      list: [], // 学生列表
      listLoading: true, // 学生列表获取loading
      page: 1, // 当前页码
      limit: 5, // 每页记录数
      total: 0, // 总记录数
      addCheckLoading: false, // 校验loading
      edited: false, // 判断编辑或增加，决定表单提交的@click事件
      editedIndex: 0, // 编辑的初始表单数据获取
      editObj: {
        index: 0,
        stu: []
      },
      // 表单校验速度太快，体现不出等待loading，所以加了个timer hh
      timer: null,
      searchObj: {
        name: ''
      },
      limitObj: {
        page: 1,
        limit: 0
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
    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.search(this.searchObj)
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.search(this.searchObj)
    },
    getData() {
      this.listLoading = true
      getLimitedStus(this.page, this.limit).then(response => {
        this.list = response.data.stuList
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.checkedItemArr = val
      // 选中时，就已执行 this.$refs.multipleTable.toggleRowSelection(val)总的
      // this.$refs.multipleTable.selection 单击一行的行数据
      //  :cell-style="{padding: '10px 0'}" 设置表格行高
    },
    search(searchName) {
      if (searchName === '') {
        this.getData()
      } else {
        this.listLoading = true
        searchLimitedStus(this.searchObj, this.page, this.limit).then(response => {
          if (response.data.currentPage !== 0) {
            this.changeCurrentPage(response.data.currentPage)
          }
          this.list = response.data.stuList
          this.total = response.data.total
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
          this.search(this.searchObj)
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
            this.search(this.searchObj)
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
            this.search(this.searchObj)
            this.addCheckLoading = false
          })
          this.$message({
            type: 'success',
            message: '修改成功'
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
      this.checked(formName)
    },
    checked(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!')
          this.obj = this.form
          this.obj.id = this.total
          console.log(this.obj)
          // alert(this.form.birthday)
          addStus(this.obj).then(response => {
            this.search(this.searchObj)
            this.addCheckLoading = false
            // console.log(this.list)
          })
          this.$message({
            type: 'success',
            message: '增加成功'
          })
          this.dialogFormVisible = false
        } else {
          // console.log('error submit!!')
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

