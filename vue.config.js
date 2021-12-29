// module.exports = {
//   chainWebpack: config => {
//     config.set('externals', {
//
//     })
//     return config
//   }
//
//todo 设置多环境配置
  module.exports = {
    configureWebpack: {
      externals: {
        'vue': 'Vue',
        // 'vue-router': 'Router',
        'axios': 'axios',
        'element-ui': 'ElementUI',
        // "lodash":"lodash",
        "vuex":"Vuex",
        "jquery": "jQuery",
        'echarts': 'echarts'
      }
    }
  }

  // chainWebpack: config => {
  //   // cdn
  //   const cdn = {
  //     css: [
  //       // element-ui css
  //       // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
  //     ],
  //     js: [
  //       // vue must at first!
  //       'https://cdn.bootcdn.net/ajax/libs/vue/3.1.2/vue.cjs.min.js',
  //       // element-ui js
  //       'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.3/index.min.js'
  //     ]
  //   }
  //   config.plugin('html')
  //     .tap(args => {
  //       args[0].cdn = cdn
  //
  //       return args
  //     })
  // }
  // }
