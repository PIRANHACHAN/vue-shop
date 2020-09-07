<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-input @clear="getUserList" clearable placeholder="请输入搜索内容" v-model="queryInfo.query">
            <el-button @click="getUserList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible=true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username" width="180"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="handleUserStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="175">
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
                  @click="getEditUserInfo(scope.row.id)"
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
      :before-close="handleUserCloseDialogConfirm"
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      @close="handleUserCloseAddDialogReset"
      title="添加用户"
      width="40%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="90px"
        ref="addFormRef"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input type="password" v-model="addForm.checkpassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleUserClickResetAddDialog">重置</el-button>
        <el-button @click="handleAddUser" type="primary">立即添加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :before-close="handleUserCloseDialogConfirm"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      @close="handleUserCloseEditDialogReset"
      title="修改用户信息"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="90px"
        ref="editFormRef"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleEditUser" type="primary">提交修改</el-button>
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
        <p>当前用户：{{currentUserInfo.username}}</p>
        <p>当前角色：{{currentUserInfo.role_name}}</p>
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
export default {
  data() {
    let checkPassword = async (rule, value, callback) => {
      if (this.addForm.password !== '') {
        await this.$refs.addFormRef.validateField('password')
      }
      callback()
    }

    let checkPassword2 = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        return callback(new Error('两次输入密码不一致，请重新输入！'))
      }
      callback()
    }

    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱地址'))
    }

    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
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
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
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
      this.$http.get('users', { params: this.queryInfo }).then((res) => {
        const result = res.data
        if (result.meta.status !== 200)
          return this.$message.error('获取用户列表失败')
        this.userList = result.data.users
        this.total = result.data.total
      })
    },

    handleCurrentPageChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },

    handlePageSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },

    handleUserStateChange(userinfo) {
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          const result = res.data
          if (result.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('用户状态设置失败')
          }
          this.$message.success('用户状态设置成功')
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

    handleUserClickResetAddDialog() {
      this.$confirm('确认重置吗？')
        .then((_) => {
          this.handleUserCloseAddDialogReset()
        })
        .catch((_) => {})
    },

    handleAddUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        this.$http.post('users', this.addForm).then((res) => {
          const result = res.data
          if (result.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.getUserList()
        })
      })
    },

    handleUserCloseEditDialogReset() {
      this.$refs.editFormRef.resetFields()
    },

    getEditUserInfo(id) {
      this.$http.get(`users/${id}`).then((res) => {
        const result = res.data
        if (result.meta.status !== 200)
          return this.$message.error('查询用户失败')
        this.editForm = result.data
        this.editDialogVisible = true
      })
    },

    handleEditUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            const result = res.data
            if (result.meta.status !== 200)
              return this.$message.error('修改用户失败')
            this.$message.success('修改用户成功')
            this.editDialogVisible = false
            this.getUserList()
          })
      })
    },

    handleDeleteUser(id) {
      this.$confirm('此操作将永久删除该用户，是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then((res) => {
            const result = res.data
            if (result.meta.status !== 200)
              return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.getUserList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    getRolesList(userinfo) {
      this.currentUserInfo = userinfo
      this.$http.get('roles').then((res) => {
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList = result.data
        this.setUserRoleDialogVisible = true
      })
    },

    handleSetUserRole() {
      if (!this.newRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      this.$http
        .put(`users/${this.currentUserInfo.id}/role`, {
          rid: this.newRoleId,
        })
        .then((res) => {
          const result = res.data
          if (result.meta.status !== 200) {
            return this.$message.error('分配用户角色失败')
          }
          this.$message.success('分配用户角色成功')
          this.getUserList()
          this.setUserRoleDialogVisible = false
        })
    },

    handleCloseSetUserRoleDialogReset() {
      this.newRoleId = ''
      this.currentUserInfo = {}
    },
  },
}
</script>

<style lang="less" scoped></style>
