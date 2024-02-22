module.exports = {
  devServer: {
    contentBase: './public'
  },
  css: {
    loaderOptions: {
      scss: {
        data: `@import "~@/assets/scss/base/variables";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true
      })
  }
}
