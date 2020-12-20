//前台页面（没有directory属性）
const front = [{
	name: 'index',
	title: '所有示例链接'
}]

//二级页面（directory属性为打包后的目录，没有该属性默认打包在根目录）
const demo = [{
	name: 'menu',
	title: '菜单示例',
}, {
	name: 'banner',
	title: 'banner示例',
}, {
	name: 'about',
	title: 'about示例',
}]

//批量写入属性
demo.forEach(item => {
	item.directory = 'demo' //目录名称需要跟实际项目目录名称一致（src/view/demo/）
})

module.exports = {
	route: [...front, ...demo]
}