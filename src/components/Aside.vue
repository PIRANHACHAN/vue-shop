<template>
  <div>
    <div class="logo">
      <router-link to="home">
        <img alt="logo" src="@/assets/logo.png" />
        <span :style="isCollapse ? { display: 'none' } : { display: 'inline-block' }">Vue后台管理系统</span>
      </router-link>
    </div>

    <el-menu
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activePath"
      active-text-color="#4b9bff"
      background-color="#fff"
      router
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
  </div>
</template>

<script>
import { getMenuList } from '@/api/menu.js'
export default {
  name: 'Aside',
  props: ['isCollapse'],
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
    getMenuList() {
      getMenuList().then((res) => {
        this.menuList = res.data
      })
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
  border-top: 1px solid #f8f8f8;
}
.logo {
  text-align: center;
  height: 63px;
  line-height: 63px;
  img {
    height: 65%;
    display: inline-block;
    margin-top: 10px;
    vertical-align: -13px;
  }
  span {
    font-size: 22px;
    font-family: consolas, '宋体' serif;
    color: #333;
    margin-left: 5px;
  }
}
</style>
