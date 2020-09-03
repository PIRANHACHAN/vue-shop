<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        :closable="false"
        center
        show-icon
        title="添加商品信息"
        type="info"
      ></el-alert>

      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        label-width="100px"
        ref="addFormRef"
      >
        <el-tabs
          :before-leave="handleTabBeforeLeave"
          tab-position="left"
          @tab-click="handleTabClicked"
          v-model="activeIndex"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="goodsCateList"
                :props="cascaderProps"
                @change="handleUserSelectCate"
                clearable
                filterable
                v-model="addForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in manyTableData"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :key="i"
                  :label="label"
                  border
                  v-for="(label, i) in item.attr_vals"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in onlyTableData"
            >
              <el-input :value="item.attr_vals.join(',')"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :auto-upload="false"
              :before-remove="handleUploadPicBeforeRemove"
              :headers="uploadHeader"
              :on-preview="handleUploadPicPreview"
              :on-remove="handleUploadPicRemove"
              :on-success="handleUploadPicSuccess"
              list-type="picture-card"
              multiple
              ref="uploadPic"
            >
              <el-button size="small" slot="trigger" type="primary"
                >选取图片</el-button
              >
              <el-button
                @click="handleSubmitPicUpload"
                size="small"
                style="margin-top: 10px; display: block;"
                type="success"
                >点击上传</el-button
              >
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button
              @click="handleAddGoods"
              class="add-goods-btn"
              type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="previewVisible" title="图片预览" width="50%">
      <img :src="previewPath" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

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
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadHeader: { Authorization: window.sessionStorage.getItem('token') },
      previewPath: '',
      previewVisible: false,
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.goodsCateList = res.data
    },

    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCateId}/attributes`,
        {
          params: {
            sel: this.selName,
          },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数/属性失败')
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })

      if (this.selName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    handleUserSelectCate() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    handleTabBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },

    handleTabClicked() {
      if (this.activeIndex === '1') {
        return this.getParamsData()
      }
      if (this.activeIndex === '2') {
        return this.getParamsData()
      }
    },

    handleUploadPicBeforeRemove() {},

    handleUploadPicPreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },

    handleUploadPicRemove(file) {
      const fileIndex = this.addForm.pics.findIndex((val) => {
        return val.pic === file.response.data.tmp_path
      })
      this.addForm.pics.splice(fileIndex, 1)
    },

    handleSubmitPicUpload() {
      this.$refs.uploadPic.submit()
    },

    handleUploadPicSuccess(res) {
      this.addForm.pics.push({ pic: res.data.tmp_path })
      this.$message.success('上传图片成功')
    },

    handleAddGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(','),
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    selectedCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    selName() {
      if (this.activeIndex === '1') {
        return 'many'
      }
      if (this.activeIndex === '2') {
        return 'only'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  min-width: 330px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview-img {
  width: 100%;
}

.add-goods-btn {
  margin-top: 15px;
}
</style>
