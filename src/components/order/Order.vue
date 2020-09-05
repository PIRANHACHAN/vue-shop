<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="9">
          <el-input
            @clear="getOrdersList"
            @keyup.enter.native="getOrdersList"
            clearable
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
          >
            <el-button
              @click="getOrdersList"
              icon="el-icon-search"
              slot="append"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="修改收货地址"
              placement="top"
            >
              <el-button
                @click="showEditAddressVisible"
                size="small"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="查询物流信息"
              placement="top"
            >
              <el-button
                size="small"
                type="success"
                icon="el-icon-location"
              ></el-button>
            </el-tooltip>
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

    <el-dialog
      @close="handleAddressDialogCloseReset"
      title="修改收货地址"
      :visible.sync="addressVisible"
      width="40%"
    >
      <el-form
        status-icon
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="90px"
      >
        <el-form-item label="省市区/县" prop="publiCity">
          <el-cascader
            filterable
            clearable
            v-model="addressForm.publiCity"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailed">
          <el-input clearable v-model="addressForm.detailed"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditAddress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './city_data2017_element.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      cityData,
      addressForm: {
        publiCity: '',
        detailed: '',
      },
      addressFormRules: {
        publiCity: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        detailed: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },

    handleCurrentPageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },

    handlePageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },

    showEditAddressVisible() {
      this.addressVisible = true
    },

    handleEditAddress() {
      console.log(this.addressForm)
    },

    handleAddressDialogCloseReset() {
      this.$refs.addressFormRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
