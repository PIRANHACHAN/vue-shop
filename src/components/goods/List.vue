<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="9">
        <el-input
          @clear="getGoodsList"
          @keyup.enter.native="getGoodsList"
          clearable
          placeholder="试试搜索：牛仔裤"
          v-model="queryInfo.query"
        >
          <el-button @click="getGoodsList" icon="el-icon-search" slot="append"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="goAddPage" type="primary">添加商品</el-button>
      </el-col>
    </el-row>

    <el-table :data="goodsList" border stripe>
      <el-table-column align="center" label="#" type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column align="center" label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
      <el-table-column align="center" label="商品重量" prop="goods_weight" width="85px"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="add_time" width="160px">
        <template slot-scope="scope">
          {{
          scope.row.add_time | dateFormat
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="130px">
        <template slot-scope="scope">
          <el-button @click="handleEditGoods" icon="el-icon-edit" size="small" type="primary"></el-button>
          <el-button
            @click="handleDeleteGoods(scope.row.goods_id)"
            icon="el-icon-delete"
            size="small"
            type="danger"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[5, 10, 20, 30]"
      :total="total"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </el-card>
</template>

<script>
import { getGoodsList, handleDeleteGoods } from '@/api/goods.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      getGoodsList(this.queryInfo).then((res) => {
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },

    goAddPage() {
      this.$router.push('goods/add')
    },

    handleDeleteGoods(goodId) {
      this.$confirm('此操作会删除商品，是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          handleDeleteGoods(goodId).then((res) => {
            this.$message.success('删除商品成功')
            this.getGoodsList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    handleEditGoods() {
      window.alert('该功能尚未完成！')
    },

    handleCurrentPageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    handlePageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
  },
}
</script>

<style lang="less" scoped></style>
