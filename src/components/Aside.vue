<template>
  <el-menu
    background-color="#333744"
    text-color="#fff"
    active-text-color="#4b9bff"
    unique-opened
    router
  >
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="menuIconsList[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item
        :index="'/' + childItem.path + ''"
        v-for="childItem in item.children"
        :key="childItem.id"
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
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data',
      },
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
  },
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}
</style>
