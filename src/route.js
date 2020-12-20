//前台页面（没有directory属性）
const front = []

//dome页面（directory属性为打包后的目录，没有该属性默认打包在根目录）
const demo = [{
	name: 'menu',//菜单demo
	title: 'menu',
	directory: 'demo' //目录名称需要跟实际项目目录名称一致（src/view/demo/）
}]

module.exports = {
	route: [...front, ...demo]
}