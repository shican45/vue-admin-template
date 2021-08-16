<template>
  <div>
    <el-dialog :show-close="false" :title="title" :visible.sync="visible">
      <slot name="contents" />
      <div slot="footer" class="dialog-footer">
        <el-button style="width:130px;" @click="back">取 消</el-button>
        <el-button type="primary" style="width:130px;" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'MyDialog',
  props: {
    title: {
      type: String,
      default: () => {
        return '弹出层'
      }
    },
    dialogFormVisible: {
      type: Boolean,
      required: true
    }

  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    'dialogFormVisible': function(newVal, oldVal) {
      this.visible = newVal
    },
    'visible': function(newVal, oldVal) {
      this.$emit('backBtn', newVal)
    }
  },
  methods: {
    back() {
      this.visible = false
    },
    submit() {
      this.$emit('submitBtn', true)
    }
  }
}
</script>
