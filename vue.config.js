module.exports = {
  // 托管到gitee需要设置publicPath
  // publicPath: process.env.NODE_ENV === 'production' ? '/piranhachan/' : '',
  /* devServer: {
    proxy: {
      '/api': {
        target: 'http://api.piranhachan.top/api/private/v1/',
        // target: 'http://111.231.241.139:8889/api/private/v1/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  }, */
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
      })

      config.plugin('html').tap((args) => {
        args[0].isProd = true
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development', (config) => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap((args) => {
        args[0].isProd = false
        return args
      })
    })
  },
}
