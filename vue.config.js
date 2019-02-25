module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://development.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
