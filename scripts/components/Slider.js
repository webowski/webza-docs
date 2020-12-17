// import Swiper, { Navigation, Pagination } from 'swiper'
import Swiper from 'swiper/bundle'

// Swiper.use([Navigation, Pagination]);

let sliders = document.querySelectorAll('.slider')
let slidersInstances = []

sliders.forEach((slider, i) => {
	let container = slider.querySelector('.swiper-container')

	let options = {
		speed: slider.dataset.speed || 300,
		loop: slider.dataset.loop || true,
	}

	slidersInstances[i] = new Swiper(container, options)
})

window.sliders = slidersInstances
