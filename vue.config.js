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
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
      config.externals = { ...externals }
    }
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
