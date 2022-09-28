const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //引用html处理插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //CSS分离（不分离时是通过js动态写入html里）
const SpritesmithPlugin = require('webpack-spritesmith') //雪碧图工具
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //引用打包清理插件
const NODE_ENV = process.env.NODE_ENV; //环境变量
const route = require('./src/route').route //导入页面路由
let pages_entry = {} //多个页面入口

//项目模式，多入口模式为true，单一入口为false
const multiple_mode = false

const resource_path = 'static' //自定义资源打包目录

const is_production = NODE_ENV === 'production' //判断是否生产环境

let plugins = [
    new CleanWebpackPlugin(), //打包清理插件
    new MiniCssExtractPlugin({ //分离出入口样式文件
        filename: resource_path ? `${resource_path}/css/[name].[contenthash].css` : 'css/[name].[contenthash].css'
    }),
    new SpritesmithPlugin({ //生成雪碧图和样式
        src: {
            cwd: './src/images/sprite', //要生成雪碧图的目录
            glob: '*.png'
        },
        target: { //最终生成的雪碧图路径
            image: './src/sprite/sprite.png',
            css: [
                [
                    path.resolve('./src/sprite/sprite.css'), {
                        format: 'sprite_template'
                    }
                ]
            ]
        },
        customTemplates: {
            'sprite_template': data => {
                var shared = '.sprite { background-image: url(I) }'
                    .replace('I', data.sprites[0].image)
                var perSprite = data.sprites.map(function(sprite) {
                    return '.sprite-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
                        .replace('N', sprite.name)
                        .replace('W', sprite.width)
                        .replace('H', sprite.height)
                        .replace('X', sprite.offset_x)
                        .replace('Y', sprite.offset_y)
                }).join('\n')
                console.log(shared + '\n' + perSprite)
                return shared + '\n' + perSprite
            },
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
            chunks: ['vendors', 'main', name], //会插入同名js到html底部，vendors是第三方工具库；main是入口文件（引用了所有自定义的公共库）
            directory,
            template: directory ? `./src/view/${directory}/${name}/index.ejs` : `./src/view/${name}/index.ejs`,
            filename: directory ? `${directory}/${name}/index.html` : `${name}.html`, //多页面需要指定打包后的文件名
        })
    )

    //如果是多个入口模式，根据路由生成多个入口文件
    if (multiple_mode) {
        pages_entry[name] = directory ? `./src/view/${directory}/${name}/index.js` : `./src/view/${name}/index.js`
    }
})

module.exports = {
    mode: NODE_ENV, //环境模式
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0', //使用局域网IP可以打开
        port: 9028,
        open: 'http://localhost:9028', //启动后自动打开
        inline: true //dev服务器模式
    },
    entry: {
        main: './src/entry.js', //入口文件（主js模块，引用自定义的公共库和样式入口文件）
        ...pages_entry //页面入口文件（多入口模式才需要）
    },
    // 提取第三方工具库
    optimization: {
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
        publicPath: '/',
        filename: resource_path ? `${resource_path}/js/[name].[contenthash].js` : 'js/[name].[contenthash].js',
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
                        outputPath: resource_path ? `${resource_path}/images` : 'images', //资源的打包目录，相对于dist目录
                        publicPath: resource_path ? `/${resource_path}/images` : '/images', //所有引用的图片路径最终会被替换为这个
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: resource_path ? `${resource_path}/iconfont` : 'iconfont', //资源的打包目录，相对于dist目录
                        publicPath: resource_path ? `/${resource_path}/iconfont` : '/iconfont', //所有引用的资源路径最终会被替换为这个
                    }
                }]
            },
        ]
    },
    plugins
};