<template>
  <div>
    <el-card>
      <el-alert :closable="false" show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="goodsCateList"
            :props="cascaderProps"
            @change="handleUserSelectCate"
            clearable
            filterable
            v-model="selectGoodsCateKeys"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs @tab-click="handleTabsClick" v-model="activeTabsName">
        <el-tab-pane label="添加参数" name="many">
          <el-button
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
            size="small"
            type="primary"
          >添加参数</el-button>
          <el-table :data="manyTableData" boder stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleTagClose(index,scope.row)"
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputNewTagConfirm(scope.row)"
                  @keyup.enter.native="handleInputNewTagConfirm(scope.row)"
                  class="input-new-tag"
                  ref="inputNewTagRef"
                  size="small"
                  v-if="scope.row.inputNewTagVisible"
                  v-model="scope.row.inputNewTagValue"
                ></el-input>
                <el-button
                  @click="showInputNewTag(scope.row)"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="openEditDialog(scope.row)"
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                >编辑</el-button>
                <el-button
                  @click="handleDeleteParams(scope.row)"
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
            size="small"
            type="primary"
          >添加属性</el-button>
          <el-table :data="onlyTableData" boder stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleTagClose(index,scope.row)"
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputNewTagConfirm(scope.row)"
                  @keyup.enter.native="handleInputNewTagConfirm(scope.row)"
                  class="input-new-tag"
                  ref="inputNewTagRef"
                  size="small"
                  v-if="scope.row.inputNewTagVisible"
                  v-model="scope.row.inputNewTagValue"
                ></el-input>
                <el-button
                  @click="showInputNewTag(scope.row)"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="openEditDialog(scope.row)"
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                >编辑</el-button>
                <el-button
                  @click="handleDeleteParams(scope.row)"
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+dialogTitleText"
      :visible.sync="addDialogVisible"
      @close="handleAddDialogCloseReset"
      width="40%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="90px"
        ref="addFormRef"
        status-icon
      >
        <el-form-item :label="dialogTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="handleAddParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'编辑'+dialogTitleText"
      :visible.sync="editDialogVisible"
      @close="handleEditDialogCloseReset"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="90px"
        ref="editFormRef"
        status-icon
      >
        <el-form-item :label="dialogTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="handleEditParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsCateList,
  getParamsData,
  handleAddParams,
  getEditParams,
  handleEditParams,
  handleDeleteParams,
  saveAttrVals,
} from '@/api/goods.js'
export default {
  data() {
    return {
      goodsCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      selectGoodsCateKeys: [],
      activeTabsName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    getGoodsCateList() {
      getGoodsCateList().then((res) => {
        this.goodsCateList = res.data
      })
    },

    getParamsData() {
      if (this.selectGoodsCateKeys.length !== 3) {
        this.selectGoodsCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      getParamsData(this.selectedCateId, { sel: this.activeTabsName }).then(
        (res) => {
          // 将attr_vals循环保存为数组
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 单独控制NEWTAG文本框的显示与输入的值
            item.inputNewTagVisible = false
            item.inputNewTagValue = ''
          })
          if (this.activeTabsName === 'many') {
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
          }
        }
      )
    },

    handleUserSelectCate() {
      this.getParamsData()
    },

    handleTabsClick() {
      this.getParamsData()
    },

    handleAddDialogCloseReset() {
      this.$refs.addFormRef.resetFields()
    },

    handleAddParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        handleAddParams(this.selectedCateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeTabsName,
        }).then((res) => {
          this.$message.success(`添加${this.dialogTitleText}成功`)
          this.getParamsData()
        })
        this.addDialogVisible = false
      })
    },

    handleEditDialogCloseReset() {
      this.$refs.editFormRef.resetFields()
    },

    openEditDialog(currentParams) {
      this.editDialogVisible = true
      this.getEditParams(currentParams)
    },

    getEditParams(currentParams) {
      getEditParams(this.selectedCateId, currentParams.attr_id, {
        attr_sel: this.activeTabsName,
      }).then((res) => {
        this.editForm = res.data
      })
    },

    handleEditParams() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        handleEditParams(this.selectedCateId, this.editForm.attr_id, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeTabsName,
        }).then((res) => {
          this.$message.success(`修改${this.dialogTitleText}成功`)
          this.getParamsData()
        })
        this.editDialogVisible = false
      })
    },

    handleDeleteParams(currentParams) {
      this.$confirm(
        `此操作会删除该${this.dialogTitleText}，是否继续？`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          handleDeleteParams(this.selectedCateId, currentParams.attr_id).then(
            (res) => {
              this.$message.success(`删除${this.dialogTitleText}成功`)
              this.getParamsData()
            }
          )
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    handleTagClose(index, currentParams) {
      currentParams.attr_vals.splice(index, 1)
      this.saveAttrVals(currentParams)
    },

    showInputNewTag(currentParams) {
      currentParams.inputNewTagVisible = true
      /**
       * $nextTick()的作用
       * 当页面上的元素被重新渲染之后，才会执行回调函数中的代码
       */
      this.$nextTick((_) => {
        this.$refs.inputNewTagRef.$refs.input.focus()
      })
    },

    handleInputNewTagConfirm(currentParams) {
      if (currentParams.inputNewTagValue.trim().length === 0) {
        currentParams.inputNewTagValue = ''
        currentParams.inputNewTagVisible = false
        return
      }
      currentParams.attr_vals.push(currentParams.inputNewTagValue.trim())
      currentParams.inputNewTagValue = ''
      currentParams.inputNewTagVisible = false
      this.saveAttrVals(currentParams)
    },

    saveAttrVals(currentParams) {
      saveAttrVals(this.selectedCateId, currentParams.attr_id, {
        attr_name: currentParams.attr_name,
        attr_sel: currentParams.attr_sel,
        attr_vals: currentParams.attr_vals.join(' '),
      }).then((res) => {
        this.$message.success(`修改${this.dialogTitleText}标签成功`)
      })
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.selectGoodsCateKeys.length !== 3) {
        return true
      }
      return false
    },
    selectedCateId() {
      if (this.selectGoodsCateKeys.length === 3) {
        return this.selectGoodsCateKeys[2]
      }
      return null
    },
    dialogTitleText() {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}

.el-cascader {
  min-width: 330px;
}

.el-tag {
  margin-left: 10px;
  margin-top: 5px;
  float: left;
}

.button-new-tag {
  margin-left: 10px;
  margin-top: 5px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  float: left;
}

.input-new-tag {
  margin-left: 10px;
  margin-top: 5px;
  width: 90px;
  vertical-align: bottom;
  float: left;
}
</style>
