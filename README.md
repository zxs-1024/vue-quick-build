# vue-quick-build

:wrench: 使用 Vue CLI 3.0 快速构建前端应用

## Util

### [axios](https://github.com/axios/axios)

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

### [jsencrypt](<[JSEncrypt](http://travistidwell.com/jsencrypt/)>)

RSA Javascript 加密的解决方案

## 环境变量

```bash
NODE_ENV = 'production'
BASE_URL = '/'
VUE_APP_NAME = 'vue-quick-build'
VUE_APP_FETCH_URL = 'https://production.com/'
VUE_APP_PUBLIC_KEY = 'VUE_APP_PUBLIC_KEY'
```

## mixin

## 组件异步加载

## 构建优化

### element-ui 按需引用

```js
// babel.config.js
module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      },
      'syntax-dynamic-import'
    ]
  ]
}
```

### gzip 压缩

```js
const CompressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {
  configureWebpack: config => {
    const plugins = [
      // gzip 压缩
      new CompressionPlugin({
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8
      })
    ]

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
}
```

### 删除 console.log

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    const plugins = [
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
      })
    ]

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
}
```

### 可视化 webpack 输出文件

```js
module.exports = {
  configureWebpack: config => {
    const plugins = [new BundleAnalyzerPlugin()]

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
}
```

## 项目配置

### 设置目录别名 alias

```js
module.exports = {
  // 别名 alias
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  }
}
```

### 代理配置

```js
module.exports = {
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
```

### 环境配置

新建 .env.development 、.env.test、.env.production 文件

```js
// .env.development
NODE_ENV = 'development'
BASE_URL = '/'
VUE_APP_NAME = 'vue-quick-build'
VUE_APP_FETCH_URL = 'http://192.168.0.1/
VUE_APP_PUBLIC_KEY = 'VUE_APP_PUBLIC_KEY'

// .env.test
NODE_ENV = 'test'
BASE_URL = '/'
VUE_APP_NAME = 'vue-quick-build'
VUE_APP_FETCH_URL = 'https://test.com/'
VUE_APP_PUBLIC_KEY = 'VUE_APP_PUBLIC_KEY'

// .env.production
NODE_ENV = 'production'
BASE_URL = '/'
VUE_APP_NAME = 'vue-quick-build'
VUE_APP_FETCH_URL = 'https://production.com/'
VUE_APP_PUBLIC_KEY = 'VUE_APP_PUBLIC_KEY'
```

```json
// package.json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "dev-build": "vue-cli-service build --mode development",
    "test-build": "vue-cli-service build --mode test",
    "build": "vue-cli-service build"
  }
}
```
