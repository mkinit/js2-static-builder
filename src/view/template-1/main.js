//轮播图
import Swiper from '../../library/swiper-8.3.0/swiper-bundle.min.js'
const swiper = new Swiper('.swiper', {
	speed: 1000,
	loop: true,
	effect: 'fade',
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
		pauseOnMouseEnter: true
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
})