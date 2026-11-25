(() => {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-go]'));
    const status = carousel.querySelector('[data-carousel-status]');
    if (slides.length !== 3 || dots.length !== slides.length) return;

    let activeIndex = 0;

    const showSlide = index => {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
            if (isActive) slide.removeAttribute('inert');
            else slide.setAttribute('inert', '');
        });
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
        if (status) status.textContent = `Imagen ${activeIndex + 1} de ${slides.length}`;
    };

    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1));
    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => showSlide(activeIndex + 1));
    dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.carouselGo))));

    carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showSlide(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showSlide(activeIndex + 1);
        }
    });

    let touchStartX = null;
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    carousel.addEventListener('touchend', event => {
        if (touchStartX === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) showSlide(activeIndex + (delta < 0 ? 1 : -1));
        touchStartX = null;
    }, { passive: true });
})();
