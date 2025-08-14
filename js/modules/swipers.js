export function initSwipers() {
	if (typeof Swiper === 'undefined') {
		console.error('Swiper is not loaded');
		return;
	}

	try {
		// Collection Swiper Instance
		const collectionSwiper = new Swiper('.collection-swiper', {
			loop: true,
			centeredSlides: false,
			slidesPerView: 1,
			spaceBetween: 16,
			initialSlide: 0,
			navigation: {
				nextEl: '.collection .swiper-button-next',
				prevEl: '.collection .swiper-button-prev'
			},
			pagination: {
				el: '.collection .swiper-pagination',
				clickable: true
			},
			breakpoints: {
				768: { slidesPerView: 2 },
				1024: { slidesPerView: 3 }
			},
			on: {
				init: function () {
					const slides = document.querySelectorAll('.collection-swiper .swiper-slide');
				}
			}
		});

		// Favourites Swiper Instance
		const favouritesSwiper = new Swiper('.favourites-swiper', {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 16,
			navigation: {
				nextEl: '.favourites-next',
				prevEl: '.favourites-prev'
			},
			pagination: {
				el: '.favourites-pag',
				clickable: true
			},
			breakpoints: {
				768: { slidesPerView: 2 },
				1024: { slidesPerView: 4 }
			}
		});

		// New Products Swiper Instance
		const newProductsSwiper = new Swiper('.new-products-swiper', {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 16,
			navigation: {
				nextEl: '.new-products-next',
				prevEl: '.new-products-prev'
			},
			breakpoints: {
				768: { slidesPerView: 2 }
			}
		});

		// New Products Filter Buttons
		const filterButtons = document.querySelectorAll('.filter-buttons button');
		const allSlides = Array.from(document.querySelectorAll('.new-products-swiper .swiper-slide'));
		const updateFilter = (filter) => {
			allSlides.forEach(slide => {
				const card = slide.querySelector('.new-product-card');
				if (!card) return;
				const match = filter === 'all' || card.dataset.category === filter;
				slide.style.display = match ? '' : 'none';
			});
			newProductsSwiper.update();
			newProductsSwiper.slideTo(0);
		};
		filterButtons.forEach(btn => btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			updateFilter(btn.dataset.filter);
		}));
		updateFilter('coffee');

		// Instagram Swiper Instance
		const instaSwiper = new Swiper('.insta-swiper', {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 12,
			pagination: {
				el: '.insta-pag',
				clickable: true
			},
			breakpoints: {
				768: { slidesPerView: 3 },
				1024: { slidesPerView: 5 }
			}
		});

	} catch (error) {
		console.error('Error initializing Swiper:', error);
	}
}


