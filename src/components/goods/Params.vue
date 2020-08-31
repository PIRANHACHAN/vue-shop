<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectGoodsCateKeys"
            :options="goodsCateList"
            :props="cascaderProps"
            @change="handleUserSelectCate"
            clearable
            filterable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <el-tab-pane label="添加参数" name="many">
          <el-button size="small" type="primary" :disabled="isBtnDisabled"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="添加属性" name="only">
          <el-button size="small" type="primary" :disabled="isBtnDisabled"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>

      <el-table>
        <el-table-column></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
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
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return
      }
      this.goodsCateList = res.data
    },

    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${
          this.selectGoodsCateKeys[this.selectGoodsCateKeys.length - 1]
        }/attributes`,
        {
          params: {
            sel: this.activeTabsName,
          },
        }
      )
      console.log(res)
    },

    handleUserSelectCate() {
      if (this.selectGoodsCateKeys.length !== 3) {
        this.selectGoodsCateKeys = []
        return
      }
      this.getParamsList()
    },

    handleTabsClick() {
      console.log(this.activeTabsName)
      this.getParamsList()
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.selectGoodsCateKeys.length !== 3) {
        return true
      }
      return false
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-cascader {
  min-width: 300px;
}
</style>
