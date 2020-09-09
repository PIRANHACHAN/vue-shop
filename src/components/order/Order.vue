<template>
  <div>
    <el-card>
      <el-row>
        <!-- 此处后端接口未完成 -->
        <el-col :span="9">
          <el-input
            @clear="getOrdersList"
            @keyup.enter.native="getOrdersList"
            clearable
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
          >
            <el-button @click="getOrdersList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column align="center" label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column align="center" label="订单价格" prop="order_price" width="130"></el-table-column>
        <el-table-column align="center" label="是否付款" prop="pay_status" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否发货" width="90">
          <template slot-scope="scope">{{ scope.row.is_send }}</template>
        </el-table-column>
        <el-table-column align="center" label="下单时间" width="160">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="130">
          <template>
            <el-tooltip
              :enterable="false"
              class="item"
              content="修改收货地址"
              effect="dark"
              placement="top"
            >
              <el-button
                @click="openEditAddressVisible"
                icon="el-icon-edit"
                size="small"
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              content="查询物流信息"
              effect="dark"
              placement="top"
            >
              <el-button
                @click="checkGoodsProgress"
                icon="el-icon-location"
                size="small"
                type="success"
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
      :visible.sync="addressVisible"
      @close="handleAddressDialogCloseReset"
      title="修改收货地址"
      width="40%"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        label-width="90px"
        ref="addressFormRef"
        status-icon
      >
        <el-form-item label="省市区/县" prop="publiCity">
          <el-cascader
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            clearable
            filterable
            v-model="addressForm.publiCity"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailed">
          <el-input clearable v-model="addressForm.detailed"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button @click="handleEditAddress" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="progressVisible" class="goods-progress" title="查询物流信息" width="40%">
      <el-timeline :reverse="false">
        <el-timeline-item
          :key="i"
          :timestamp="val.ftime"
          v-for="(val, i) in progressData"
        >{{val.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/assets/cityData.js'
import { getOrdersList, checkGoodsProgress } from '@/api/orders.js'
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
      progressVisible: false,
      progressData: [],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    getOrdersList() {
      getOrdersList(this.queryInfo).then((res) => {
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },

    handleCurrentPageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },

    handlePageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },

    openEditAddressVisible() {
      this.addressVisible = true
    },

    // 此处后端接口未完成，无法提交
    handleEditAddress() {
      this.addressVisible = false
    },

    handleAddressDialogCloseReset() {
      this.$refs.addressFormRef.resetFields()
    },

    checkGoodsProgress() {
      checkGoodsProgress().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取物流信息失败！')
        }
        this.progressData = res.data
      })
      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
