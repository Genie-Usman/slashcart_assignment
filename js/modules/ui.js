// UI

export function initUI() {
	const searchIcon = document.getElementById('search-icon');
	const searchOverlay = document.getElementById('search-overlay');
	const closeSearchBtn = document.getElementById('close-search-btn');
	const cartIcon = document.getElementById('cart-icon');
	const cartOverlay = document.getElementById('cart-overlay');
	const closeCartBtn = document.getElementById('cart-close-btn');
	const menuToggle = document.querySelector('.menu-toggle');
	const mobileMenu = document.querySelector('.mobile-menu');
	const mobileMenuCloseBtn = document.querySelector('.mobile-menu .cart-close-btn');

	searchIcon?.addEventListener('click', e => { e.preventDefault(); searchOverlay?.classList.add('visible'); });
	closeSearchBtn?.addEventListener('click', () => searchOverlay?.classList.remove('visible'));
	cartIcon?.addEventListener('click', e => { e.preventDefault(); cartOverlay?.classList.add('is-visible'); });
	closeCartBtn?.addEventListener('click', () => cartOverlay?.classList.remove('is-visible'));
	document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { searchOverlay?.classList.remove('visible'); cartOverlay?.classList.remove('is-visible'); } });

	if (menuToggle && mobileMenu) {
		menuToggle.addEventListener('click', () => { mobileMenu.classList.toggle('open'); menuToggle.classList.toggle('is-active'); });
	}
	if (mobileMenuCloseBtn && mobileMenu) {
		mobileMenuCloseBtn.addEventListener('click', () => { mobileMenu.classList.remove('open'); menuToggle?.classList.remove('is-active'); });
	}
	const navItems = document.querySelectorAll('.nav-item');
	navItems.forEach(item => {
		const link = item.querySelector('.navbar-links');
		if (!link) return;
		link.addEventListener('click', e => {
			if (window.innerWidth <= 1024) {
				e.preventDefault();
				item.classList.toggle('dropdown-open');
				navItems.forEach(other => { if (other !== item) other.classList.remove('dropdown-open'); });
			}
		});
	});
}


