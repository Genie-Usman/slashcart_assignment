// Tabs

export function initTabs() {
	const tabs = document.querySelectorAll('.tab');
	const collages = document.querySelectorAll('.collage');
	const products = document.querySelectorAll('.product');
	if (!tabs.length) return;

	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			tabs.forEach(t => t.classList.remove('active'));
			tab.classList.add('active');
			const type = tab.dataset.type;
			collages.forEach(img => img.classList.remove('active'));
			products.forEach(img => img.classList.remove('active'));
			setTimeout(() => {
				if (type === 'coffee' || type === 'capsule') {
					collages.forEach(img => img.dataset.category === type && img.classList.add('active'));
					products.forEach(img => img.dataset.category === type && img.classList.add('active'));
				} else {
					collages.forEach(img => img.classList.add('active'));
					products.forEach(img => img.classList.add('active'));
				}
			}, 20);
		});
	});
}


