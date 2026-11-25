(() => {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-go]'));
    const toggles = Array.from(carousel.querySelectorAll('[data-carousel-toggle]'));
    const status = carousel.querySelector('[data-carousel-status]');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (slides.length !== 3 || dots.length !== 9 || toggles.length !== 3) return;

    let activeIndex = 0;
    let manuallyPaused = Boolean(reduceMotion?.matches);
    let hoverPaused = false;
    let focusPaused = false;
    let timer = null;
    let touchStartX = null;

    const syncPlaybackControls = () => {
        const paused = manuallyPaused || hoverPaused || focusPaused || document.hidden || Boolean(reduceMotion?.matches);
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', String(manuallyPaused));
            toggle.setAttribute('aria-label', manuallyPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
            const pauseIcon = toggle.querySelector('[data-icon-pause]');
            const playIcon = toggle.querySelector('[data-icon-play]');
            if (pauseIcon) pauseIcon.hidden = manuallyPaused;
            if (playIcon) playIcon.hidden = !manuallyPaused;
        });
        window.clearInterval(timer);
        timer = null;
        if (!paused) {
            timer = window.setInterval(() => showSlide(activeIndex + 1), 3000);
        }
    };

    const showSlide = index => {
        activeIndex = (index + slides.length) % slides.length;
        carousel.dataset.activeSlide = String(activeIndex);

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
            if (isActive) slide.removeAttribute('inert');
            else slide.setAttribute('inert', '');
        });

        dots.forEach(dot => {
            const isActive = Number(dot.dataset.carouselGo) === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
        if (status) status.textContent = `Diapositiva ${activeIndex + 1} de ${slides.length}`;
    };

    carousel.querySelectorAll('[data-carousel-prev]').forEach(button => {
        button.addEventListener('click', () => {
            showSlide(activeIndex - 1);
            syncPlaybackControls();
        });
    });
    carousel.querySelectorAll('[data-carousel-next]').forEach(button => {
        button.addEventListener('click', () => {
            showSlide(activeIndex + 1);
            syncPlaybackControls();
        });
    });
    dots.forEach(dot => dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.carouselGo));
        syncPlaybackControls();
    }));
    toggles.forEach(toggle => toggle.addEventListener('click', () => {
        manuallyPaused = !manuallyPaused;
        syncPlaybackControls();
    }));

    carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showSlide(activeIndex - 1);
            syncPlaybackControls();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showSlide(activeIndex + 1);
            syncPlaybackControls();
        }
    });

    carousel.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'mouse') return;
        hoverPaused = true;
        syncPlaybackControls();
    });
    carousel.addEventListener('pointerleave', event => {
        if (event.pointerType !== 'mouse') return;
        hoverPaused = false;
        syncPlaybackControls();
    });
    carousel.addEventListener('focusin', () => {
        focusPaused = true;
        syncPlaybackControls();
    });
    carousel.addEventListener('focusout', event => {
        if (carousel.contains(event.relatedTarget)) return;
        focusPaused = false;
        syncPlaybackControls();
    });
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    carousel.addEventListener('touchend', event => {
        if (touchStartX === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) {
            showSlide(activeIndex + (delta < 0 ? 1 : -1));
            syncPlaybackControls();
        }
        touchStartX = null;
    }, { passive: true });
    document.addEventListener('visibilitychange', syncPlaybackControls);
    reduceMotion?.addEventListener?.('change', event => {
        if (event.matches) manuallyPaused = true;
        syncPlaybackControls();
    });

    showSlide(0);
    syncPlaybackControls();
})();
