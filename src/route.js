//前台页面（没有directory）
const front = [{
	name: 'index',
	title: '首页 - 这是页面的标题'
}]

//后台页面（directory属性为打包后的目录，没有该属性默认打包在根目录）
const admin = [{
	name: 'login',
	title: '登录 - 二级目录',
	directory: 'admin'//目录名称需要跟实际项目目录名称一致（src/view/admin/）
}]

module.exports = {
	route: [...front, ...admin]
}