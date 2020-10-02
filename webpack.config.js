const HtmlWebpackPlugin = require('html-webpack-plugin') //引用html处理插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //CSS分离（不分离时是通过js动态写入html里）
const SpritesmithPlugin = require('webpack-spritesmith') //雪碧图工具
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //引用打包清理插件
const NODE_ENV = process.env.NODE_ENV; //环境变量
const route = require('./src/route').route //导入页面路由
let pages_entry = {} //多个页面入口

//项目模式，默认为多入口模式，单一入口为false
const multiple_mode = true

//定义开发环境和生产环境的打包目录
/* 自定义打包目录，所有静态资源都会打包到一个目录，根据后端目录结构设置。
 * 比如ThinkPHP的静态资源都存放在“public\static\”目录下，自定义打包后后端就不用去批量替换；不需要自定义留空即可。
 * 目录名称前不能有斜杠，名称后必须要有斜杠，如：“assets/”。
 * 各种资源默认是有目录的，图片：images；样式：css；模块：js;字体图标：iconfont；
 */
const production_path = 'assets/'

const is_production = NODE_ENV === 'production' //判断是否生产环境

const is_production_path = production_path !== '' //判断是否有自定义打包目录

let plugins = [
    new CleanWebpackPlugin(), //打包清理插件
    new MiniCssExtractPlugin({ //分离出入口样式文件
        filename: is_production && is_production_path ? production_path + 'css/[name].[contenthash].css' : 'css/[name].[contenthash].css'
    }),
    new SpritesmithPlugin({ //生成雪碧图和样式
        src: {
            cwd: './src/images/sprite', //要生成雪碧图的目录
            glob: '*.png'
        },
        target: { //最终生成的雪碧图路径
            image: './src/sprite/sprite.png',
            css: './src/sprite/sprite.css'
        },
        apiOptions: {
            cssImageRef: "./sprite.png" //最终的雪碧图地址（file-loader会把生成后的图片进行资源打包），相对于打包后的css路径
        },
        spritesmithOptions: {
            algorithm: 'top-down', // 从上到下生成方向.
            padding: 2 // 每个小图标之间的间隙
        }
    })
]

route.forEach(item => {
    const title = item.title
    const name = item.name
    const directory = item.directory
    plugins.push(
        new HtmlWebpackPlugin({ //多页面需要new多个配置
            title,
            name, //用于定义页面body的类名
            chunks: ['vendors', 'main', name], //会插入同名js到html底部，vendors是第三方工具库；main是入口文件（引用了所有自定义的公共库），
            template: directory ? `./src/view/${directory}/${name}/${name}.ejs` : `./src/view/${name}/${name}.ejs`,
            filename: directory ? `${directory}/${name}.html` : `${name}.html`, //多页面需要指定打包后的文件名
        })
    )

    //如果是多页面入口，根据路由生成多个入口文件
    if (multiple_mode) {
        pages_entry[name] = directory ? `./src/view/${directory}/${name}/${name}.js` : `./src/view/${name}/${name}.js`
    }
})

module.exports = {
    mode: NODE_ENV, //环境模式
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 208,
        open: 'http://localhost:208',
        inline: true
    },
    entry: {
        main: './src/entry.js', //入口文件（主js模块，引用自定义的公共库和样式入口文件）
        ...pages_entry //页面入口文件
    },
    // 提取第三方工具库
    optimization: {
        // 找到chunk中共享的模块,取出来生成单独的chunk
        splitChunks: {
            chunks: "initial", // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            cacheGroups: {
                vendors: { // 抽离第三方插件（npm下载的包）
                    test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
                    name: "vendors",
                }
            }
        },
    },
    output: {
        path: __dirname + '/dist/', //跟入口文件同一层级目录，如果没有指定该属性配置，webpack会自动创建一个dist目录
        publicPath:'/',
        filename: is_production && is_production_path ? production_path + '/js/[name].[contenthash].js' : 'js/[name].[contenthash].js',
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.less$/,
                loader: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: is_production && is_production_path ? '/' + production_path + 'images/' : './images/', //资源的打包目录，相对于dist目录
                        publicPath: is_production && is_production_path ? '/' + production_path + 'images/' : '/images/', //所有引用的图片路径最终会被替换为这个
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: is_production && is_production_path ? '/' + production_path + 'iconfont/' : '/iconfont/', //资源的打包目录，相对于dist目录
                        publicPath: is_production && is_production_path ? '/' + production_path + 'iconfont/' : '/iconfont/', //所有引用的资源路径最终会被替换为这个
                    }
                }]
            },
        ]
    },
    plugins
};