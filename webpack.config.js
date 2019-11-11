const path = require('path')
const htmlPlugin = require('html-webpack-plugin')
const uglify = require('uglifyjs-webpack-plugin') 
const extractText = require('extract-text-webpack-plugin')
const glob = require('glob')
const purifyCssPlugin = require('purifycss-webpack')
const type=process.env.type
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
// const cleanWebpackPlugin= require('clean-webpack-plugin')
var website={
    publicPath:'http://127.0.0.1:1717/'
}
module.exports = {
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
        filename:'[name].js',
        publicPath:website.publicPath

    },
    module:{
        rules:[
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
                use:['html-withimg-loader']
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
        splitChunks: {
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
                    minSize: 0    // 只要超出0字节就生成一个新包
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
            template:'./src/index.html'
        }),
        new extractText('css/[name].css'),
        // new webpack.optimization.minimize(),
        new purifyCssPlugin({
            paths:glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        new webpack.BannerPlugin('每段代码加上注释'),
        new copyWebpackPlugin([{
            from:path.join(__dirname,'src/public'),
            to:'./public'
        }]),
        // new cleanWebpackPlugin()
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        compress:true,
        port:1717
    }
}