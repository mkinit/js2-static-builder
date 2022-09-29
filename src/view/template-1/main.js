import QRCode from 'qrcode'
import Swiper from 'swiper/swiper-bundle.min'
window.onload = () => {
	//轮播图
	const swiper = new Swiper('.banner-2-swiper', {
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
	})

	//二维码生成器
	QRCode.toDataURL(location.origin, {}, function(err, url) {
		if (err) throw err
		var img = document.querySelector('.qrcode-img')
		img.src = url
	})
}