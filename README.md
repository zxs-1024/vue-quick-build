# 构建优化

## 组件异步加载

结合 Vue 的异步组件和 Webpack 的代码分割功能，轻松实现路由组件的懒加载，Vue CLI 3.0 默认配置。

[路由懒加载 | Vue Router](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html#%E6%8A%8A%E7%BB%84%E4%BB%B6%E6%8C%89%E7%BB%84%E5%88%86%E5%9D%97)

```js
export default new Router({
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
```

## element-ui 按需引入

借助 babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的。

首先，安装 babel-plugin-component：

```bash
yarn add babel-plugin-component -D
// or
npm install babel-plugin-component -D
```

[Element | 按需引入](http://element-cn.eleme.io/#/zh-CN/component/quickstart#an-xu-yin-ru)

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

## gzip 压缩

生成类似 chunk-vendors.f5cbf099.js.gz 格式的文件。

首先，安装 compression-webpack-plugin：

```bash
yarn add compression-webpack-plugin -D
// or
npm install compression-webpack-plugin -D
```

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

## 删除 console.log

删除 console.log，减少代码体积。

首先，安装 uglifyjs-webpack-plugin：

```bash
yarn add uglifyjs-webpack-plugin -D
// or
npm install uglifyjs-webpack-plugin -D
```

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

## 可视化 webpack 构建

可视化 webpack 打包文件优化工具，帮助你分析打包文件，实现更好的优化。

首先，安装 webpack-bundle-analyzer：

```bash
yarn add webpack-bundle-analyzer -D
// or
npm install webpack-bundle-analyzer -D
```

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  configureWebpack: config => {
    const plugins = [new BundleAnalyzerPlugin()]

    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
}
```

## CDN 引入

使用 externals 配置，构建时忽略 npm 模块。

```js
module.exports = {
  configureWebpack: config => {
    const externals = {
      vue: 'Vue',
      axios: 'axios',
      vuex: 'Vuex',
      jsencrypt: 'JSEncrypt',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }

    if (isProduction) {
      config.externals = { ...externals }
    }
  }
}
```

在 public/index.html 配置 CND 引入

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title>vue-quick-build</title>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but zm-basic-single-sign doesn't work properly without
        JavaScript enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>

    <!-- built files will be auto injected -->

    <script src="https://cdn.bootcss.com/vue/2.6.6/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.5.4/index.js"></script>
    <script src="https://cdn.bootcss.com/jsencrypt/3.0.0-rc.1/jsencrypt.min.js"></script>
  </body>
</html>
```

# 项目配置

## 设置目录别名 alias

```js
function resolve(dir) {
  return path.join(__dirname, dir)
}

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

## 代理配置

请求 /api/users 现在会被代理到请求 http://192.168.0.1:8080/users。

> 注意 api 已经被 pathRewrite 替换。

[devServer.proxy | webpack](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)

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

## 环境配置

新建 .env.development 、.env.test、.env.production 文件。

> Vue CLI 启动时会将 .env 文件中的配置注入到环境变量中，除了 `NODE_ENV`、 `BASE_URL`，其余变量需以 `VUE_APP_` 开头。

[环境变量和模式 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

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

在 package.json 脚本中加入快捷命令：

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

## use pug

Pug 是一款健壮、灵活、功能丰富的模板引擎，由 Jade 改名而来。

[添加一个新的 Loader | Vue CLI](https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9)

安装 pug loader

```bash
yarn add pug pug-plain-loader -D
// or
npm install pug pug-plain-loader -D
```

```js
module.exports = {
  // use pug
  chainWebpack: config => {
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .end()
  }
}
```

## 多页面配置

在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字

[multi-page | Vue CLI](https://cli.vuejs.org/zh/config/#pages)

```js
module.exports = {
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
  }
}
```

# vue 小技巧

## 灵活运用 mixin

如果你引用了 Element UI 的分页组件，可以将通用的 data 属性、methods、created 声明钩子提取到 mixin 中。

```js
// src/mixins/tableMixin.js
export default {
  data() {
    return {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      loading: false
    }
  },

  created() {
    this.searchData()
  },

  methods: {
    // 防止报错，可以在组件中声明，替换 mixin 中的 searchData 函数
    searchData() {},
    handleSizeChange(size) {
      this.pageSize = size
      this.searchData()
    },

    handleCurrentChange(page) {
      this.pageNo = page
      this.searchData()
    },

    handleSearchData() {
      this.pageNo = 1
      this.searchData()
    }
  }
}
```
