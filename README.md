### Vue 后台管理系统（前端）

[前端项目预览](http://bg.piranhachan.top)

[后端项目地址](https://gitee.com/wBekvam/vueShop-api-server)

##### 目前迭代了一个版本，旧版本可查看分支[OldVersion0.1](https://github.com/PIRANHACHAN/vue-shop/tree/OldVersion0.1)

#### 功能

> 用于管理用户账号，商品分类，商品信息，订单，数据统计等业务功能

#### 项目技术栈

- Vue
- Vue-router
- Element-UI
- Lodash
- Axios
- Echarts

#### 开发

```shell
# 克隆项目
git clone https://github.com/PIRANHACHAN/vue-shop.git

# 进入项目目录
cd vue-shop

# 安装依赖
npm install

# 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run serve

# 浏览器访问 http://localhost:8080
```

#### 发布

```bash
# 构建生产环境
npm run build
```

#### 后端项目的环境配置

1. 安装 MySQL 数据库
2. 安装 Node.js 环境
3. 配置项目相关信息
4. 启动项目
   1. 使用 phpstudy 导入数据库并运行
   2. node app.js
5. 使用 ApiPost 或 Postman 测试后台项目接口
