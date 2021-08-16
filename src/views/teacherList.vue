<template>
  <div>
    <!-- :inline=true,查询条件在一条直线上，false,不在一条直线上 -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="讲师姓名">
        <el-input v-model="teacherQuery.name" placeholder="讲师姓名" clearable />
      </el-form-item>
      <el-form-item label="教师级别">
        <el-select v-model="teacherQuery.level" placeholder="教师级别" clearable>
          <el-option label="低级讲师" value="0" />
          <el-option label="中级讲师" value="1" />
          <el-option label="高级讲师" value="2" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="创建时间">
                <el-col :span="11">
                <el-date-picker type="date"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="起时间" v-model="teacherQuery.begin" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker placeholder="止时间" v-model="teacherQuery.end" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item> -->

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getTeacherList1()">查询</el-button>
        <el-button type="primary" @click="rest()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表头显示数据tableData -->
    <el-table
      :data="list"
      border
      style="width: 100%"
    >

      <!-- prop 对应的是对象的属性，label是表头标签，width是表头宽度 -->
      <el-table-column
        fixed
        prop="gmtCreate"
        label="创建时间"
        width="150"
      />

      <el-table-column
        prop="name"
        label="讲师姓名"
        width="120"
      />

      <!-- 不加width 自动扩宽 -->
      <el-table-column prop="intro" label="讲师简介" />
      <!-- <el-table-column
            prop="intro"
            label="讲师简介"
            width="120">
            </el-table-column> -->

      <!-- 属性中根据属性值判断显示  <template slot-scope="scope">-->
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level==0?'低级讲师':scope.row.level==1?'中席讲师':'高级讲师' }}
        </template>
      </el-table-column>

      <!-- <el-table-column
            fixed="left"
            label="操作"
            width="100"> -->
      <el-table-column
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->

          <!-- router 修改跳转路由到修改页面 -->
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <!-- <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button> -->
            <el-button type="text" size="mini">修改</el-button>
          </router-link>

          <!-- <el-button type="text" size="small">修改</el-button> -->
          <el-button size="small" type="text" @click="delClick(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 @current-change = getTeacherList1 这个配置必须要有，
        注意：但是切记不能写出getTeacherList1(),因为这么写 默认是无参，下一页时候，page一直就是1；如果这样写getTeacherList1，分页插件就会去更新page这个值
        因为分页点击下一页要去调用查询getTeacherList1方法-->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getTeacherList1"
    />
  </div>
</template>

<script>
// 引入teacher.js中的方法
// import { getTeacherList } from '@/api/teacher'
import teacher from '@/api/teacher'

export default {
  data() {
    return {
      list: null, // 返回显示的数据
      page: 1, // 当前页数
      limit: 5, // 显示条数
      total: 0, // 总页数
      teacherQuery: {} // 查询条件封装对象
    }
  },
  created() {
    this.getTeacherList1()
  },
  methods: {
    getTeacherList1(page = 1) {
      // debugger
      this.page = page
      teacher.getTeacherList(this.page, this.limit, this.teacherQuery)
        .then(response => {
          // debugger
          // console.log(response.data.rows)
          //  console.log(response.data.total)
          this.list = response.data.rows
          this.total = response.data.total
        })
        .catch()
    },
    rest() {
      this.teacherQuery = {}
      this.getTeacherList1()
    },
    delClick(id) {
      // 先提示 ，在删除
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.delTeacher(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTeacherList1()
          })
      })
      // .catch(() => {
      // this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      // });
      // });
      // teacher.delTeacher(id)
    }
  }
}
</script>
