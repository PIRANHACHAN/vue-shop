<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddGoodsCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :columns="goodsCateCols"
        :data="goodsCateList"
        :expand-type="false"
        :selection-type="false"
        border
        class="tree-table"
        index-text="#"
        show-index
        stripe
      >
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:#20b2aa" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:#d32d27" v-else></i>
        </template>-->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-row>
            <el-button
              @click="showEditGoodsCateDialog(scope.row.cat_id)"
              icon="el-icon-edit"
              type="primary"
            >编辑</el-button>
            <el-button
              @click="handleDeleteGoodsCate(scope.row.cat_id)"
              icon="el-icon-delete"
              type="danger"
            >删除</el-button>
          </el-row>
        </template>
      </tree-table>

      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[2, 5, 10, 15]"
        :total="total"
        @current-change="handleCurrentPageChange"
        @size-change="handlePageSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>

    <el-dialog
      :visible.sync="addCateDialogVisible"
      @close="handleCateDialogClose"
      title="添加分类"
      width="40%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="90px"
        ref="addCateFormRef"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentGoodsCateList"
            :props="cascaderProps"
            @change="handleParentGoodsCateChange"
            clearable
            filterable
            placeholder="试试搜索：女装"
            ref="goodCateCasRef"
            v-model="selectGoodsCateKeys"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span class="dialog-footer" slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button @click="handleAddGoodsCate" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="editCateDialogVisible"
      @close="handleEditDialogCloseReset"
      title="编辑分类"
      width="40%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="90px"
        ref="editCateFormRef"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button @click="handleEditGoodsCateName" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2,
      },
      goodsCateList: [],
      total: 0,
      goodsCateCols: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentGoodsCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: 'true',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      selectGoodsCateKeys: [],

      editCateDialogVisible: false,
      editCateForm: {},
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
    },

    handleCurrentPageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCateList()
    },

    handlePageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },

    showAddGoodsCateDialog() {
      this.getParentGoodsCateList()
      this.addCateDialogVisible = true
    },

    getParentGoodsCateList() {
      this.$http
        .get('categories', {
          params: {
            type: 2,
          },
        })
        .then((res) => {
          const result = res.data
          if (result.meta.status !== 200) {
            return this.$message.error('获取商品分类失败')
          }
          this.parentGoodsCateList = result.data
        })
    },

    handleParentGoodsCateChange(cateList) {
      // 点击后收起下拉框
      this.$refs.goodCateCasRef.dropDownVisible = false
      if (this.selectGoodsCateKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectGoodsCateKeys[
          this.selectGoodsCateKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectGoodsCateKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    handleAddGoodsCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getGoodsCateList()
        this.getParentGoodsCateList()
      })
    },

    handleCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectGoodsCateKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    showEditGoodsCateDialog(id) {
      this.getThisCateInfo(id)
      this.editCateDialogVisible = true
    },

    async getThisCateInfo(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败')
      }
      this.editCateForm = res.data
    },

    handleEditDialogCloseReset() {
      this.$refs.editCateFormRef.resetFields()
    },

    handleEditGoodsCateName() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类名称失败')
        }
        this.$message.success('修改分类名称成功')
        this.getGoodsCateList()
        this.editCateDialogVisible = false
      })
    },

    handleDeleteGoodsCate(id) {
      this.$confirm('此操作将会删除该分类，是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`categories/${id}`).then((res) => {
            const result = res.data
            if (result.meta.msg === '删除失败')
              return this.$message.error('删除商品分类失败')
            this.$message.success('删除商品分类成功')
            this.getGoodsCateList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style> 