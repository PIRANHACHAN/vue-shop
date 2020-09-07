<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img alt="头像" src="../assets/logo.png" />
      </div>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        class="login-form"
        label-width="0px"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="handleLogin" type="primary">登录</el-button>
          <el-button @click="handleResetLogin" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度为6-15位',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    handleResetLogin() {
      this.$refs.loginFormRef.resetFields()
    },
    handleLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('username', res.data.username)
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2d3436;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
    transform: rotate(180deg);
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
