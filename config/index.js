'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    dev: { // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // 主要请求必应图片
            '/bingApis': {
                target: 'https://www.bing.com', //请求域名
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/bingApis': '/'
                }
            },
            // 谷歌搜索返回的结果
            '/apiGoogle': {
                target: 'http://suggestqueries.google.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/apiGoogle': '/'
                }
            },
            //必应搜索返回的结果
            '/apiBing': {
                target: 'https://api.bing.com',
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apiBing': '/'
                },
            },
            // 百度搜索返回结果
            '/apiBaidu': {
                target: 'https://suggestion.baidu.com',
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apiBaidu': '/'
                },
            },
            // 好搜搜索返回结果
            '/apiSo': {
                target: 'https://sug.so.360.cn',
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apiSo': '/'
                },
            },
            // 狗狗搜索返回结果
            '/apiSogou': {
                target: 'http://w.sugg.sogou.com',
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apiSogou': '/'
                },
            },
            // 淘宝搜索返回结果
            '/apiTaobao': {
                target: 'https://suggest.taobao.com',
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apiTaobao': '/'
                },
            },
        },

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}