<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-input
            @clear="getUserList"
            @keyup.enter.native="getUserList"
            clearable
            placeholder="输入用户名进行搜索"
            v-model="queryInfo.query"
          >
            <el-button @click="getUserList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="openAddUserDialog" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-switch @change="handleUserStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-row>
              <el-tooltip
                :enterable="false"
                class="item"
                content="编辑用户"
                effect="dark"
                placement="top"
              >
                <el-button
                  @click="openEditUserDialog(scope.row.id)"
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :enterable="false"
                class="item"
                content="删除用户"
                effect="dark"
                placement="top"
              >
                <el-button
                  @click="handleDeleteUser(scope.row.id)"
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :enterable="false"
                class="item"
                content="分配角色"
                effect="dark"
                placement="top"
              >
                <el-button
                  @click="getRolesList(scope.row)"
                  icon="el-icon-setting"
                  size="small"
                  type="warning"
                ></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        :total="total"
        @current-change="handleCurrentPageChange"
        @size-change="handlePageSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>

    <el-dialog
      :close-on-click-modal="false"
      :title="id === 1 ? '添加用户' : '编辑用户'"
      :visible.sync="userDialogVisible"
      @close="resetUserDialogWhenClosed"
      width="40%"
    >
      <el-form
        :model="userForm"
        :rules="id === 1 ? addUserFormRules : editUserFormRules"
        label-width="90px"
        ref="userFormRef"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="id === 2" v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="id === 1">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword" v-if="id === 1">
          <el-input type="password" v-model="userForm.checkpassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button @click="addOrEditUser" type="primary">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="setUserRoleDialogVisible"
      @close="handleCloseSetUserRoleDialogReset"
      title="分配用户角色"
      width="40%"
    >
      <div>
        <p>当前用户：{{ currentUserInfo.username }}</p>
        <p>当前角色：{{ currentUserInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select placeholder="请选择" v-model="newRoleId">
            <el-option
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
              v-for="item in rolesList"
            ></el-option>
          </el-select>
        </p>
      </div>

      <span class="dialog-footer" slot="footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button @click="handleSetUserRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  handleUserStateChange,
  handleAddUser,
  getUserInfo,
  handleEditUser,
  handleDeleteUser,
  handleSetUserRole,
} from '@/api/users.js'
import { getRolesList } from '@/api/rights.js'
export default {
  data() {
    let checkPassword = async (rule, value, callback) => {
      if (this.userForm.password !== '') {
        await this.$refs.userFormRef.validateField('password')
      }
      return callback()
    }

    let checkPassword2 = (rule, value, callback) => {
      if (value !== this.userForm.password) {
        return callback(new Error('两次输入密码不一致，请重新输入！'))
      }
      return callback()
    }

    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return callback()
      }
      return callback(new Error('请输入合法的邮箱地址'))
    }

    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('请输入合法的手机号码'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,

      id: 0, // 1--添加用户，2--编辑用户
      userDialogVisible: false,
      userForm: {
        id: '',
        username: '',
        password: '',
        checkpassword: '',
        email: '',
        mobile: '',
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度为6-15位',
            trigger: 'blur',
          },
          { validator: checkPassword, trigger: 'blur' },
        ],
        checkpassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkPassword2, trigger: 'blur' },
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editUserFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      setUserRoleDialogVisible: false,
      rolesList: [],
      currentUserInfo: {},
      newRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUserList(this.queryInfo).then((res) => {
        this.userList = res.data.users
        this.total = res.data.total
      })
    },

    handleCurrentPageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    handlePageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    handleUserStateChange(userInfo) {
      handleUserStateChange(userInfo.id, userInfo.mg_state).then((res) => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('用户状态设置失败')
        }
        this.$message.success('用户状态设置成功')
      })
    },

    resetUserDialogWhenClosed() {
      this.$refs.userFormRef.resetFields()
    },

    clearUserForm() {
      Object.keys(this.userForm).forEach((key) => {
        this.userForm[key] = ''
      })
    },

    openAddUserDialog() {
      this.id = 1
      this.userDialogVisible = true
      this.clearUserForm()
    },

    addOrEditUser() {
      if (this.id === 1) {
        return this.handleAddUser()
      }
      if (this.id === 2) {
        return this.handleEditUser()
      }
    },

    handleAddUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (!valid) return
        handleAddUser(this.userForm).then((res) => {
          this.$message.success('添加用户成功')
          this.getUserList()
        })
        this.userDialogVisible = false
      })
    },

    openEditUserDialog(uId) {
      this.id = 2
      this.userDialogVisible = true
      getUserInfo(uId).then((res) => {
        this.userForm.id = res.data.id
        this.userForm.username = res.data.username
        this.userForm.email = res.data.email
        this.userForm.mobile = res.data.mobile
      })
    },

    handleEditUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (!valid) return
        handleEditUser(this.userForm.id, {
          email: this.userForm.email,
          mobile: this.userForm.mobile,
        }).then((res) => {
          this.$message.success('修改用户成功')
          this.getUserList()
        })
        this.userDialogVisible = false
      })
    },

    handleDeleteUser(uId) {
      this.$confirm('此操作将永久删除该用户，是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          handleDeleteUser(uId).then((res) => {
            this.$message.success('删除用户成功')
            this.getUserList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    getRolesList(userInfo) {
      this.currentUserInfo = userInfo
      getRolesList().then((res) => {
        this.rolesList = res.data
      })
      this.setUserRoleDialogVisible = true
    },

    handleSetUserRole() {
      if (!this.newRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      handleSetUserRole(this.currentUserInfo.id, {
        rid: this.newRoleId,
      }).then((res) => {
        if (res) {
          this.$message.success('分配用户角色成功')
        }
        this.getUserList()
      })
      this.setUserRoleDialogVisible = false
    },

    handleCloseSetUserRoleDialogReset() {
      this.newRoleId = ''
      this.currentUserInfo = {}
    },
  },
}
</script>

<style lang="less" scoped></style>
