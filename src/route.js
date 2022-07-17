//前台页面（没有directory属性）
const front = [{
	name: 'index',
	title: '所有示例链接'
}]

//二级页面（directory属性为打包后的目录，没有该属性默认打包在根目录）
const demo = [{
	name: 'iconfont',
	title: '字体图标示例',
}, {
	name: 'sprite',
	title: '精灵图示例',
}, {
	name: 'menu',
	title: '菜单示例',
}, {
	name: 'banner',
	title: '横幅/轮播图示例',
}, {
	name: 'cover',
	title: '单页顶部横幅示例',
}, {
	name: 'crumbs',
	title: '面包屑导航示例',
}, {
	name: 'guestbook-form',
	title: '留言表单示例',
}, {
	name: 'about',
	title: '关于我们示例',
}, {
	name: 'culture',
	title: '公司文化示例',
}, {
	name: 'friend-link',
	title: '友情链接示例',
}, {
	name: 'pagination',
	title: '分页示例',
}, {
	name: 'service',
	title: '公司业务示例',
}, {
	name: 'bottom',
	title: '底部示例',
}, {
	name: 'post-list',
	title: '内容列表示例',
},  {
	name: 'product-list',
	title: '产品列表示例',
},{
	name: 'post',
	title: '内容页示例',
},{
	name: 'sidebar',
	title: '边栏示例',
},{
	name: 'sidebar-tool',
	title: '边栏工具示例',
}]

//批量写入属性
demo.forEach(item => {
	item.directory = 'demo' //目录名称需要跟实际项目目录名称一致（src/view/demo/）
})

module.exports = {
	route: [...front, ...demo]
}