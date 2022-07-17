# 静态页面项目快速构建方案（脚手架/开发环境）

根据组件化、模块化的开发思想，用于快速构建前端静态页面项目的方案。

将页面的每一块元素拆分成可复用的组件，如头部、菜单、面包屑导航、列表、列表项、边栏、底部，需要时按需引用，方便网站某块区域的改版，不同组件的组合也可以快速构建成另一个网站。

## 模式
 - 单入口模式：所有js、css都会打包到一起，npm引用的包除外（entry.js为入口文件）
 - 多入口模式：各个页面的js、css分别打包引用（页面的js即入口文件）

## 命令
- 安装项目依赖：`npm install`
- 项目启动：`npm run static`
- 项目打包：`npm run build`

## 引用
- 组件的引用
	```
	<!-- 组件的引用（可传参） -->
	<%
	const website = {
		title:'JS2',
		description:'——static'
	}
	%>
	<%= require('../../components/header/header.ejs')({htmlWebpackPlugin,website}) %>
	```
 - HtmlWebpackPlugin组件传参注意
 webpack.config.js中引用的 HtmlWebpackPlugin 变量虽然是大写的，但是在 ejs 文件中 中使用是 htmlWebpackPlugin。否则会出现 HtmlWebpackPlugin not defined 的报错（无论导入时是什么命名，ejs中使用都是htmlWebpackPlugin）。
 - ejs中的传参，形参和实参名称必须相同，子组件有用到的参数都是必传参数，否则会报错，项目无法运行；参数的属性是可选的。
 	- 比如组件中使用了`<%= website.title %>`输出标题，但是传参时website没有title属性，输出为空，这是可以的。但是一定要传website参数
- 图片的引用
	```<img src="${require('../../images/logo.png')}">```

## 组件中的js
如果一定要在组件中编写js代码，需要使用`window.addEventListener('load',你的函数)`，否则组件的js会比入口js和第三方库的js先执行。

如果组件是在列表中循环输出的，那么函数的定义要使用const或let ，否则将执行多次。这是利用let和const不允许声明多次的特性，所以不会执行第二次。

```javascript
	/*function test(){
		console.log('这是列表项组件的js')
	}*/
	/*var test = function(){
		console.log('这是列表项组件的js')
	}*/
	const test = function(){
		console.log('这是列表项组件的js')
	}
	window.addEventListener('load',test)
```

但是最好还是不要这样咯，可以写在页面的js或公共的js中。

## 注意：
 - 项目中安装了jquery、moment是为了演示，请删除（包括iconfont、images、script、sprite目录中的演示文件）后开始你的表演。
 - 多级目录：需要在路由（src/route.js）声明要生成的目录名称属性：directory（属性值需要跟项目实际目录名称一致）
 - 打包后所有资源都是绝对路径，无法直接打开预览（不支持file://），需要服务器（本里预览推荐使用：live-server）。
 - webpack.config.js(包括导入模块)修改后需要重新启动项目
 - 首次放入图标生成精灵图时，需要重新启动项目

## 功能说明
- 添加项目根目录（src）别名，JS引用使用“@”，CSS引用使用“~@”（2020-10-2）
- CSS/JS使用contenthash标示（2020-9-30）
- 自定义打包路径（用于生产环境匹配后端资源路径）
- 分离第三方工具库，全部打包到vendors.js中（node_modules，npm下载引用的库）
- 字体打包（用于字体图标库）
- 自动生成精灵图
- 自动添加CSS前缀
- ES6语法转换
- 使用less预处理
- 使用ejs模板引擎
- 图片资源打包

## 项目结构
- webpack.config.js：工程配置文件
	- multiple_mode：可以修改工程模式
	- production_path：可自定义生产环境的资源打包路径
- package.json：项目依赖、命令配置
- postcss.config.js：CSS自动前缀插件配置
- .babelrc：低版本JS语法转换配置
- src：项目源文件
	- iconfont：字体图标（iconfont.cn）
		- iconfont.css：字体图标样式文件
	- images：图片目录
		- sprite：精灵图标原始图片（放入图标后会自动生成）
	- sprite：自动生成的精灵图目录
		- sprite.css：自动生成的精灵图样式文件
	- public：页面头部和底部的基本HTML结构
	- script：自定义公共模块
	- style：公共样式
		- style.less：项目样式入口文件
			- 所有页面公用的样式，单入口模式的页面在此引用所有样式文件
		- reset.less：初始化样式文件
		- public.less：公共样式文件
		- color.less：颜色定义文件
	- view：页面文件
	三个文件构成一个完整页面，以下为示例，暂时只有二级目录
		- index
			- index.js：页面入口文件（多入口模式的页面在此引用页面样式文件，会分别打包；单入口模式不需要此文件）
			- index.less：页面样式文件
			- index.ejs：页面结构
		- admin：后台的页面（带目录的页面）
			- login
				- login.js
				- login.less
				- login.ejs
	- components：所有组件目录
		- header：单个组件目录
			- header.ejs：组件结构
			- header.less：组件样式
	- entry.js：项目的入口文件，引用项目的样式入口文件和自定义公共模块
	- router.js：页面路由文件