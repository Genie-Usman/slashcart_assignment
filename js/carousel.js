class MiniCarousel {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector('.uc-viewport') || this._wrapViewport();
    this.track = root.querySelector('.uc-track');
    this.slides = Array.from(root.querySelectorAll('.uc-slide'));

    // Options
    const d = root.dataset;
    this.items = +d.items || 1;
    this.itemsMd = +d.itemsMd || 2;
    this.itemsSm = +d.itemsSm || 2;
    this.itemsXs = +d.itemsXs || 1;
    this.gap = +(d.gap || 16);
    this.loop = d.loop === 'true';
    this.autoplay = d.autoplay === 'true';
    this.interval = +(d.interval || 4000);
    this.anim = d.anim || 'fade-up';

    // Buttons (optional)
    this.btnPrev = root.querySelector('.uc-prev') || null;
    this.btnNext = root.querySelector('.uc-next') || null;
    if (!this.btnPrev && !this.btnNext) {
      this.btnPrev = this._createBtn('prev');
      this.btnNext = this._createBtn('next');
    }

    // Dots
    this.dotsWrap = root.querySelector('.uc-dots') || this._createDotsWrap();

    this.pointerDown = false;
    this.startX = 0;
    this.deltaX = 0;
    this.currentPage = 0;
    this.itemsPerView = 1;
    this.pages = 1;
    this.autoplayTimer = null;

    this._applyCSSVars();
    this._onResize();
    this._buildDots();
    this._updateUI(true);
    this._bind();

    this.ro = new ResizeObserver(() => this._onResize());
    this.ro.observe(this.viewport);

    if (this.autoplay) this._startAutoplay();
  }

  _wrapViewport() {
    const vp = document.createElement('div');
    vp.className = 'uc-viewport';
    this.root.insertBefore(vp, this.root.firstChild);
    vp.appendChild(this.root.querySelector('.uc-track'));
    return vp;
  }

  _applyCSSVars() {
    this.root.style.setProperty('--uc-gap', `${this.gap}px`);
  }

  _itemsForWidth(w) {
    if (w <= 480) return this.itemsXs;
    if (w <= 768) return this.itemsSm;
    if (w <= 1024) return this.itemsMd;
    return this.items;
  }

  _onResize() {
    const w = this.viewport.clientWidth;
    this.itemsPerView = this._itemsForWidth(window.innerWidth);
    this.root.style.setProperty('--uc-items', this.itemsPerView);

    this.pages = Math.max(1, Math.ceil(this.slides.length / this.itemsPerView));
    if (this.currentPage > this.pages - 1) this.currentPage = this.pages - 1;

    this._setOffset();
    this._buildDots();
    this._updateVisibleSlides();
    this._updateButtons();
  }

  _createBtn(kind) {
    const b = document.createElement('button');
    b.className = `uc-btn uc-${kind}`;
    b.setAttribute('aria-label', kind === 'prev' ? 'Previous' : 'Next');
    b.textContent = kind === 'prev' ? '❮' : '❯';
    this.root.appendChild(b);
    return b;
  }

  _createDotsWrap() {
    const d = document.createElement('div');
    d.className = 'uc-dots';
    this.root.appendChild(d);
    return d;
  }

  _buildDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';
    for (let i = 0; i < this.pages; i++) {
      const b = document.createElement('button');
      if (i === this.currentPage) b.classList.add('is-active');
      b.addEventListener('click', () => this.goTo(i));
      this.dotsWrap.appendChild(b);
    }
  }

  _updateDots() {
    if (!this.dotsWrap) return;
    [...this.dotsWrap.children].forEach((d, i) =>
      d.classList.toggle('is-active', i === this.currentPage)
    );
  }

  _bind() {
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prev());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.next());

    // Swipe
    this.viewport.addEventListener('pointerdown', e => {
      this.pointerDown = true;
      this.startX = e.clientX;
      this.deltaX = 0;
      this.track.style.transition = 'none';
      if (this.autoplay) this._stopAutoplay();
      this.viewport.setPointerCapture(e.pointerId);
    });
    this.viewport.addEventListener('pointermove', e => {
      if (!this.pointerDown) return;
      this.deltaX = e.clientX - this.startX;
      const base = this._calcOffset(this.currentPage);
      this.track.style.transform = `translateX(${base + this.deltaX}px)`;
    });
    this.viewport.addEventListener('pointerup', () => {
      if (!this.pointerDown) return;
      this.pointerDown = false;
      this.track.style.transition = '';
      const threshold = Math.max(40, this.viewport.clientWidth * 0.08);
      if (this.deltaX > threshold) this.prev();
      else if (this.deltaX < -threshold) this.next();
      else this._setOffset();
      if (this.autoplay) this._startAutoplay();
    });

    // Keyboard
    this.root.tabIndex = 0;
    this.root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    window.addEventListener('orientationchange', () => this._onResize());
  }

  _calcOffset(page) {
    const slideWidth = this.slides[0].offsetWidth;
    const gap = this.gap;
    const totalPageWidth = slideWidth * this.itemsPerView + gap * (this.itemsPerView - 1);
    const containerWidth = this.viewport.clientWidth;
    const startX = (containerWidth - totalPageWidth) / 2; // centering
    return -(page * (slideWidth + gap) * this.itemsPerView) + startX;
  }

  _setOffset() {
    this.track.style.transform = `translateX(${this._calcOffset(this.currentPage)}px)`;
  }

  _updateVisibleSlides() {
    const start = this.currentPage * this.itemsPerView;
    const end = start + this.itemsPerView;
    this.slides.forEach((s, i) => s.classList.toggle('is-inview', i >= start && i < end));
  }

  _updateButtons() {
    if (!this.btnPrev || !this.btnNext) return;
    if (this.loop) {
      this.btnPrev.disabled = false;
      this.btnNext.disabled = false;
    } else {
      this.btnPrev.disabled = this.currentPage === 0;
      this.btnNext.disabled = this.currentPage >= this.pages - 1;
    }
  }

  _updateUI(first = false) {
    if (!first) this._setOffset();
    this._updateVisibleSlides();
    this._updateButtons();
    this._updateDots();
  }

  goTo(page) {
    if (this.loop) {
      this.currentPage = (page + this.pages) % this.pages;
    } else {
      this.currentPage = Math.max(0, Math.min(page, this.pages - 1));
    }
    this._updateUI();
  }

  next() { this.goTo(this.currentPage + 1); }
  prev() { this.goTo(this.currentPage - 1); }

  _startAutoplay() {
    this._stopAutoplay();
    this.autoplayTimer = setInterval(() => this.next(), this.interval);
    this.root.addEventListener('mouseenter', () => this._stopAutoplay());
    this.root.addEventListener('mouseleave', () => this._startAutoplay());
  }

  _stopAutoplay() {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(el => new MiniCarousel(el));
});
