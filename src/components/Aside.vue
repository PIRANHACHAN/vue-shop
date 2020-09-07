<template>
  <el-menu
    :default-active="activePath"
    active-text-color="#4b9bff"
    background-color="#333744"
    router
    text-color="#fff"
    unique-opened
  >
    <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menuList">
      <template slot="title">
        <i :class="menuIconsList[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item
        :index="'/' + childItem.path"
        :key="childItem.id"
        @click="saveNavState('/' + childItem.path)"
        v-for="childItem in item.children"
      >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ childItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  data() {
    return {
      menuList: [],
      menuIconsList: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}
</style>
