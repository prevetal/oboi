// Ширина окна для ресайза
WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]
OVERLAY = document.querySelector('.overlay')


document.addEventListener('DOMContentLoaded', function () {
	// Карусель товаров
	const productsSliders = [],
		products = document.querySelectorAll('.products .swiper')

	products.forEach(function (el, i) {
		el.classList.add('products_s' + i)

		let options = {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'fraction',
				renderFraction: (currentClass, totalClass) => {
					return '<span class="' + currentClass + '"></span>' +
							'<span class="sep">/</span>' +
							'<span class="' + totalClass + '"></span>'
				}
			},
			breakpoints: {
				0: {
					spaceBetween: 24,
					slidesPerView: 'auto'
				},
				480: {
					spaceBetween: 24,
					slidesPerView: 2
				},
				768: {
					spaceBetween: 24,
					slidesPerView: 3
				},
				1280: {
					spaceBetween: 24,
					slidesPerView: 3
				},
				1418: {
					spaceBetween: 32,
					slidesPerView: 3
				}
			},
			on: {
				init: swiper => setHeight(swiper.el.querySelectorAll('.product .name')),
				resize: swiper => {
					let productNames = swiper.el.querySelectorAll('.product .name')

					productNames.forEach(el => el.style.height = 'auto')

					setHeight(productNames)
				}
			}
		}

		productsSliders.push(new Swiper('.products_s' + i, options))
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}

	Fancybox.defaults.template = {
		closeButton: '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>',
		spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
		main: null
	}


	// Всплывающие окна
	const modalBtns = document.querySelectorAll('.modal_btn')

	if (modalBtns) {
		modalBtns.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				Fancybox.close()

				Fancybox.show([{
					src: document.getElementById(el.getAttribute('data-modal')),
					type: 'inline'
				}])
			})
		})
	}


	// Увеличение картинки
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false,
		},
		Thumbs: {
			autoStart: false,
		}
	})


	// Моб. меню
	$('.mob_header .mob_menu_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').addClass('active')
		$('body').addClass('menu_open')
		$('header').addClass('show')
		$('.overlay').fadeIn(300)
	})

	$('header > .close, .overlay').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').removeClass('active')
		$('body').removeClass('menu_open')
		$('header').removeClass('show')
		$('.overlay').fadeOut(300)
	})


	// Моб. фильтр
	$('.mob_filter_btn').click(e => {
		e.preventDefault()

		$('.mob_filter_btn').toggleClass('active')
		$('.filter').slideToggle(300)
	})


	// Маска ввода
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Кастомный select
	const selects = document.querySelectorAll('select'),
		selectsArray = []

	if (selects) {
		selects.forEach(el => selectsArray.push(NiceSelect.bind(el, {
			placeholder: el.getAttribute('data-placeholder')
		})))
	}


	// Фильтр
	$priceRange = $('.filter #price_range').ionRangeSlider({
		type: 'double',
		min: 0,
		max: 14000,
		from: 140,
		to: 5140,
		step: 10,
		postfix: ' Р',
		onChange: data => {
			$('.filter .price input.from').val(data.from.toLocaleString())
			$('.filter .price input.to').val(data.to.toLocaleString())
		},
		onUpdate: data => {
			$('.filter .price input.from').val(data.from.toLocaleString())
			$('.filter .price input.to').val(data.to.toLocaleString())
		}
	}).data('ionRangeSlider')

	$('.filter .price .input').keyup(function () {
		$priceRange.update({
			from: parseInt($('.filter .price input.from').val().replace(/\s/g, '')),
			to: parseInt($('.filter .price input.to').val().replace(/\s/g, ''))
		})
	})


	$('.filter .reset_btn').click(function() {
		$priceRange.reset()

		setTimeout(() => selectsArray.forEach(el => el.update()))
	})


	// Изменение количества товара
	$('body').on('click', '.amount .minus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			minimum = parseFloat($input.data('minimum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal > minimum) $input.val(inputVal - step + unit)
	})

	$('body').on('click', '.amount .plus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			maximum = parseFloat($input.data('maximum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal < maximum) $input.val(inputVal + step + unit)
	})

	$('.amount .input').keydown(function () {
		const _self = $(this),
			maximum = parseInt(_self.data('maximum'))

		setTimeout(() => {
			if (_self.val() == '' || _self.val() == 0) _self.val(parseInt(_self.data('minimum')))
			if (_self.val() > maximum) _self.val(maximum)
		})
	})


	// Мини всплывающие окна
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if ($(this).closest('.search').length) {
				setTimeout(() => $(modalId).find('.input').focus(), 50)
			}

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Закрываем всплывашку при клике за её пределами
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})

	// Закрываем всплывашку при клике на крестик во всплывашке
	$('.mini_modal .close_btn').click(e => {
		$('.mini_modal, .mini_modal_btn').removeClass('active')

		if (is_touch_device()) $('body').css('cursor', 'default')
	})


	if (is_touch_device()) {
		const subCategories = document.querySelectorAll('header .categories .sub')

		// Подменю на тач скрине
		$('header .categories .item > a.sub_link').addClass('touch_link')

		$('header .categories .item > a.sub_link').click(function (e) {
			const $dropdown = $(this).next()

			if ($dropdown.css('visibility') === 'hidden') {
				e.preventDefault()

				subCategories.forEach(el => el.classList.remove('show'))
				$dropdown.addClass('show')

				BODY.style = 'cursor: pointer;'
			}
		})

		// Закрываем под. меню при клике за её пределами
		document.addEventListener('click', e => {
			if ($(e.target).closest('.categories').length === 0) {
				subCategories.forEach(el => el.classList.remove('show'))

				BODY.style = 'cursor: default;'
			}
		})
	}
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Перезапись ширины окна
		WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth


		// Моб. версия
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})