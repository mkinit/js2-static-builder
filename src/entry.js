//引用样式入口文件（固定）
import './style/style.less'

//引用自定义模块
import test from './script/test.js'
test()

//引用第三方模块
import jquery from 'jquery'
console.log(jquery)

//引用第三方模块
import moment from 'moment'
console.log(moment)
