const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.BASE_URL,
  productionSourceMap: false,
  pages: {
    index: {
      // page 的入口
      entry: 'src/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: 'src/subpage/main.js'
  },
  configureWebpack: config => {
    const plugins = [
      // gzip 压缩
      new CompressionPlugin({
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8
      }),
      // 删除 console.log
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      }),
      // 可视化 webpack 输出
      new BundleAnalyzerPlugin()
    ]

    // cnd 引入
    const externals = {
      vue: 'Vue',
      axios: 'axios',
      vuex: 'Vuex',
      jsencrypt: 'JSEncrypt',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
      config.externals = { ...externals }
    }
  },

  // use pug
  chainWebpack: config => {
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end()
  },

  // 别名 alias
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  },

  // 代理设置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.1:8080/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
