module.exports = {
  configureWebpack: config => {
    config.externals = {
      moment: 'moment'
    }
  },
  publicPath: '/cr-visualisation-2019/'
}