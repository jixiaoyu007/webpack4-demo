const path = require('path')
const webpack = require('webpack')
// 用于打包html 到dist目录，并引入相关js
const htmlPlugin = require('html-webpack-plugin')
//压缩js
const uglify = require('uglifyjs-webpack-plugin') 
// 分离css文件
const extractText = require('extract-text-webpack-plugin')
const glob = require('glob')
//tree shaking 过滤未使用css及js代码
const purifyCssPlugin = require('purifycss-webpack')
//复制指定静态文件到dist目录下
const copyWebpackPlugin = require('copy-webpack-plugin')
//打包前清除 dist文件夹内的部分
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
//处理.vue 文件的loader
const VueLoaderPlugin = require('vue-loader/lib/plugin')
//压缩css js文件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
var website={
    publicPath:''
}
module.exports = {
    //开发环境下开启的 方便定位到源文件内容
    devtool:'eval-source-map',
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    },
    entry:{
        entry1:path.join(__dirname,'./src/entry.js'),
        entry2:path.join(__dirname,'./src/entry2.js'),
        jquery:'jquery'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name]_[hash].js',
        publicPath:website.publicPath

    },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:['vue-loader']
            },
            {
                test:/\.css$/,
                use:extractText.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:'css-loader'
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                minimize: true,
                                plugins: [
                                    require("autoprefixer") ({
                                        browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8']
                                    })
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:50000,
                        outputPath:'/images'
                    }
                }]
            },
            {
                test:/\.(htm|html)$/i,
                use:['html-withimg-loader']//用于处理html内引入图片
            },
            {
                test:/\.less$/,
                use:extractText.extract({
                    use:[
                        {
                            loader:'css-loader'
                        },
                        {
                            loader:'less-loader'
                        }
                    ],
                    fallback:'style-loader'
                })
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader'
                },
                exclude:/node_modules/
            }
        ]
    },
    optimization: {
        //公共部分抽离
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 2000    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    plugins:[
        
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            // filename:'index.html',
            template:'./src/index.html',
            // chunks:['entry1','entry2','jquery']
        }),
        // new htmlPlugin({
        //     minify:{
        //         removeAttributeQuotes:true
        //     },
        //     hash:true,
        //     filename:'h2.html',
        //     template:'./src/h2.html',
        //     chunks:['entry2','jquery']
        // }),

        //分离css文件到指定文件夹
        new extractText('css/[name].css'),
        new purifyCssPlugin({
            paths:glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        //公共模块引用，模块内无需引用
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        new webpack.BannerPlugin('每段代码加上注释'),
        new copyWebpackPlugin([{
            from:path.join(__dirname,'src/public'),
            to:'./public'
        }]),
        // new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp:/\.css$/g,
            cssProcessor:require("cssnano"),
            cssProcessorPluginOptions:{
              preset:['default',{discardComments:{removeAll:true}}]
            },
            canPrint:true
          })
          //压缩css
       
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        compress:true,
        port:1717,
        proxy: {
            '/api': {
              target: 'http://localhost:1717/',
              changeOrigin: true
            }
        }
    },
    performance: {
        hints: false
    },
    
    // mode:'development'
    mode:'production'
}