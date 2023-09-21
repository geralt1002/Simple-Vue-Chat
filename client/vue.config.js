const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})
module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use '@/scss/_abstracts/index.scss' as *;`,
      },
    },
  },
}
