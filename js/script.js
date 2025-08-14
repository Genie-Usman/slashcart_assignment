document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Helpers ---------- */
  const debounce = (fn, wait = 100) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  /* ---------- Tabs (New Products filter) ---------- */
  (() => {
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
  })();

  /* ---------- Favourites carousel (Our Favorites) ---------- */
  (() => {
  const slidesContainer = document.querySelector('.slides-container');
    if (!slidesContainer) return;
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    let slideWidth = slides[0].offsetWidth;
    let currentPosition = 0;
    const totalSlides = slides.length / 2;
    let visibleSlides = Math.max(1, Math.round(slidesContainer.offsetWidth / slideWidth));

    const updateDots = () => {
      const dots = dotsContainer?.querySelectorAll('.dot') || [];
      dots.forEach(dot => dot.classList.remove('active'));
      const activeDotIndex = Math.floor(currentPosition / slideWidth / visibleSlides) % totalSlides;
      if (dots[activeDotIndex]) dots[activeDotIndex].classList.add('active');
    };

    const onResize = debounce(() => {
      slideWidth = slides[0].offsetWidth;
      visibleSlides = Math.max(1, Math.round(slidesContainer.offsetWidth / slideWidth));
      updateDots();
    }, 100);
    window.addEventListener('resize', onResize);

    prevBtn?.addEventListener('click', () => {
      const scrollDistance = slideWidth * visibleSlides;
      slidesContainer.scrollLeft -= scrollDistance;
      if (slidesContainer.scrollLeft <= 0) slidesContainer.scrollLeft = slidesContainer.scrollWidth / 2;
      currentPosition = slidesContainer.scrollLeft;
      updateDots();
    });

    nextBtn?.addEventListener('click', () => {
      const scrollDistance = slideWidth * visibleSlides;
      slidesContainer.scrollLeft += scrollDistance;
      if (slidesContainer.scrollLeft >= slidesContainer.scrollWidth - slidesContainer.offsetWidth - 1) {
        slidesContainer.scrollLeft = 0;
      }
      currentPosition = slidesContainer.scrollLeft;
      updateDots();
    });

    dotsContainer?.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        const index = parseInt(e.target.dataset.index, 10);
        const scrollDistance = slideWidth * visibleSlides * index;
        slidesContainer.scrollLeft = scrollDistance;
        currentPosition = scrollDistance;
        updateDots();
      }
    });

    slidesContainer.addEventListener('scroll', () => {
      currentPosition = slidesContainer.scrollLeft;
      updateDots();
    });
  })();

  /* ---------- New Products slider ---------- */
  (() => {
const slider = document.querySelector('.slider');
    if (!slider) return;
const prevProductBtn = document.getElementById('prevBtn');
const nextProductBtn = document.getElementById('nextBtn');
const filterButtons = document.querySelectorAll('.filter-buttons button');

    let allCards = Array.from(slider.children);
    let visibleCards = [];
    let currentIndex = 0;

    const getItemsPerPage = () => (window.innerWidth <= 768 ? 1 : 2);
    const getGap = () => parseFloat(getComputedStyle(slider).gap) || 24;
    const updateSliderPosition = () => {
        const cardWidth = slider.querySelector('.new-product-card')?.offsetWidth || 0;
      slider.style.transform = `translateX(${-currentIndex * (cardWidth + getGap())}px)`;
    };
    const updateNavButtons = () => {
      const ipp = getItemsPerPage();
      if (prevProductBtn) prevProductBtn.disabled = currentIndex === 0;
      if (nextProductBtn) nextProductBtn.disabled = currentIndex >= visibleCards.length - ipp;
    };
    const updateSlider = (filter = 'coffee') => {
        visibleCards = filter === 'all' ? allCards : allCards.filter(card => card.dataset.category === filter);
        slider.innerHTML = '';
        visibleCards.forEach(card => slider.appendChild(card));
        currentIndex = 0;
        updateSliderPosition();
        updateNavButtons();
    };

    nextProductBtn?.addEventListener('click', () => {
      const ipp = getItemsPerPage();
      if (currentIndex < visibleCards.length - ipp) currentIndex += ipp;
        updateSliderPosition();
        updateNavButtons();
    });
    prevProductBtn?.addEventListener('click', () => {
      const ipp = getItemsPerPage();
      if (currentIndex > 0) currentIndex -= ipp;
        updateSliderPosition();
        updateNavButtons();
    });
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateSlider(button.dataset.filter);
        });
    });
    window.addEventListener('resize', debounce(() => { updateSliderPosition(); updateNavButtons(); }, 100));
    updateSlider('coffee');
  })();

  /* ---------- Overlays & Mobile menu ---------- */
  (() => {
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
  })();

  /* ---------- Collection slider (Our Collection) ---------- */
  (() => {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.image-wrapper');
    const prevBtn = document.querySelector('.slider-button-left');
    const nextBtn = document.querySelector('.slider-button-right');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    if (!track || !slides.length) return;

    let currentIndex = 0;
    const slidesPerView = () => (window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3));
    const updateSliderPosition = () => {
      const containerWidth = document.querySelector('.slider-container').offsetWidth;
      const slideWidth = containerWidth / slidesPerView();
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      const activePage = Math.floor(currentIndex / slidesPerView());
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activePage));
    };
    const moveSlide = (direction) => {
      currentIndex += direction * slidesPerView();
      const maxIndex = slides.length - slidesPerView();
      if (currentIndex > maxIndex) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex;
      updateSliderPosition();
    };
    prevBtn?.addEventListener('click', () => moveSlide(-1));
    nextBtn?.addEventListener('click', () => moveSlide(1));
    dots.forEach((dot, idx) => { dot.addEventListener('click', () => { currentIndex = idx * slidesPerView(); updateSliderPosition(); }); });
    window.addEventListener('resize', debounce(updateSliderPosition, 100));
    updateSliderPosition();
  })();

});







/** End of file **/
