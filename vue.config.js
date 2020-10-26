module.exports = {
  configureWebpack: config => {
    config.externals = {
      moment: 'moment'
    }
  }
}