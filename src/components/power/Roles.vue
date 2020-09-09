<template>
  <div>
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
        <el-table-column label="操作" width="290">
          <template slot-scope="scope">
            <el-row>
              <el-button
                @click="openEditUserDialog(scope.row.id)"
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
                @click="openSetRightsDialog(scope.row)"
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
        <el-button @click="setRightDialogVisible=false">取 消</el-button>
        <el-button @click="handleSetRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  handleAddRoles,
  getUserInfo,
  handleEditRoles,
  handleDeleteRoles,
  handleDeleteRoleRight,
  getRightsList,
  handleSetRights,
} from '@/api/rights.js'
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
      getRolesList().then((res) => {
        this.rolesList = res.data
      })
    },

    handleAddRoles() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        handleAddRoles(this.addForm).then((res) => {
          this.getRolesList()
        })
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
      })
    },

    openEditUserDialog(rId) {
      getUserInfo(rId).then((res) => {
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },

    handleEditRoles() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        handleEditRoles(this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        }).then((res) => {
          this.$message.success('修改角色成功')
          this.getRolesList()
        })
        this.editDialogVisible = false
      })
    },

    handleDeleteRoles(rId) {
      this.$confirm('此操作将永久删除该角色，是否继续', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          handleDeleteRoles(rId).then((res) => {
            this.$message.success('删除角色成功')
            this.getRolesList()
          })
        })
        .catch((err) => {
          this.$message.info('已取消删除')
        })
    },

    handleDeleteRoleRight(role, rightId) {
      this.$confirm('此操作将删除该角色权限，是否继续', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          handleDeleteRoleRight(role.id, rightId).then((res) => {
            role.children = res.data
            this.$message.success('删除角色权限成功')
          })
        })
        .catch((err) => {
          this.$message.info('已取消删除')
        })
    },

    openSetRightsDialog(role) {
      this.roleId = role.id
      this.getLeafKeys(role, this.defSelectKeys)
      getRightsList('tree').then((res) => {
        this.rightsList = res.data
      })
      this.setRightDialogVisible = true
    },

    // 递归找到第三层权限
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },

    handleSetRights() {
      const rightsKeys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ]
      const rightsIdStr = rightsKeys.join(',')
      handleSetRights(this.roleId, { rids: rightsIdStr }).then((res) => {
        this.$message.success('更新角色权限成功')
        this.getRolesList()
      })
      this.setRightDialogVisible = false
    },

    handleCloseSetRightDialogReset() {
      this.defSelectKeys = []
    },

    handleUserCloseAddDialogReset() {
      this.$refs.addFormRef.resetFields()
    },

    handleUserCloseEditDialogReset() {
      this.$refs.editFormRef.resetFields()
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