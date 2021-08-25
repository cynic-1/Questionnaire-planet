module.exports = {
    devServer: {
        port: 8080,
    },

    publicPath: './',
    assetsDir: 'static',
    lintOnSave: false,
    runtimeCompiler: true,

    pluginOptions: {
      quasar: {
        importStrategy: 'kebab',
        rtlSupport: false
      }
    },

    transpileDependencies: [
      'quasar'
    ]
}
