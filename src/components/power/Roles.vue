<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addDialogVisible=true" type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['tabel-expand-border-bottom',i1===0?'tabel-expand-border-top':'','ele-center']"
              :key="item1.id"
              v-for="(item1,i1) in scope.row.children"
            >
              <el-col :span="5">
                <el-tag
                  @close="handleDeleteRoleRight(scope.row,item1.id)"
                  closable
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'tabel-expand-border-top','ele-center']"
                  :key="item2.id"
                  v-for="(item2,i2) in item1.children"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="handleDeleteRoleRight(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      :key="item3.id"
                      @close="handleDeleteRoleRight(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button
                @click="getEditUserInfo(scope.row.id)"
                icon="el-icon-edit"
                size="small"
                type="primary"
              >编辑</el-button>
              <el-button
                @click="handleDeleteRoles(scope.row.id)"
                icon="el-icon-delete"
                size="small"
                type="danger"
              >删除</el-button>
              <el-button
                @click="handleSetRights(scope.row)"
                icon="el-icon-setting"
                size="small"
                type="warning"
              >分配权限</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :before-close="handleUserCloseDialogConfirm"
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      @close="handleUserCloseAddDialogReset"
      title="添加角色"
      width="40%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="90px"
        ref="addFormRef"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleAddRoles" type="primary">立即添加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :before-close="handleUserCloseDialogConfirm"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      @close="handleUserCloseEditDialogReset"
      title="编辑角色"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="90px"
        ref="editFormRef"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleEditRoles" type="primary">提交修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :before-close="handleUserCloseDialogConfirm"
      :close-on-click-modal="false"
      :visible.sync="setRightDialogVisible"
      @close="handleCloseSetRightDialogReset"
      title="分配角色权限"
      width="40%"
    >
      <el-tree
        :data="rightsList"
        :default-checked-keys="defSelectKeys"
        :props="rightsTreeProps"
        check-on-click-node
        default-expand-all
        expand-on-click-node
        node-key="id"
        ref="rightsTreeRef"
        show-checkbox
      ></el-tree>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleUserCloseDialogConfirm">取 消</el-button>
        <el-button @click="handleConfirmSetRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: { roleName: '', roleDesc: '' },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' },
        ],
      },

      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' },
        ],
      },

      setRightDialogVisible: false,
      rightsList: [],
      rightsTreeProps: {
        label: 'authName',
        children: 'children',
      },

      defSelectKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      this.$http.get('roles').then((res) => {
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList = result.data
      })
    },

    handleUserCloseDialogConfirm(done) {
      this.$confirm('确认关闭吗？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },

    handleUserCloseAddDialogReset() {
      this.$refs.addFormRef.resetFields()
    },

    handleAddRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },

    handleUserCloseEditDialogReset() {
      this.$refs.editFormRef.resetFields()
    },

    async getEditUserInfo(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败')
      }
      this.editDialogVisible = true
      this.editForm = res.data
    },

    handleEditRoles() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },

    async handleDeleteRoles(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色，是否继续',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },

    async handleDeleteRoleRight(role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作将删除该角色权限，是否继续',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      this.$message.success('删除角色权限成功')
      // this.getRolesList()
      role.children = res.data
    },

    async handleSetRights(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defSelectKeys)
      this.setRightDialogVisible = true
    },

    // 递归方法找到第三层权限
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },

    handleCloseSetRightDialogReset() {
      this.defSelectKeys = []
    },

    async handleConfirmSetRights() {
      const rightsKeys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ]
      const rightsIdStr = rightsKeys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: rightsIdStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色权限失败')
      }
      this.$message.success('更新角色权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.tabel-expand-border-top {
  border-top: 1px solid #eee;
}

.tabel-expand-border-bottom {
  border-bottom: 1px solid #eee;
}

.ele-center {
  display: flex;
  align-items: center;
}
</style>