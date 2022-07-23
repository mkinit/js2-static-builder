const NODE_ENV = process.env.NODE_ENV //环境变量

//引用样式入口文件（固定）
import './style/style.less'

//生产环境不引用演示组件的样式（但样式和样式中引用到的图片还是会打包出来）
if (NODE_ENV != 'production') {
	import('./style/demo.less')
}