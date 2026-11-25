(() => {
    const heroPhoto = document.querySelector('.hero-photo');
    if (!heroPhoto) return;

    const showPlaceholder = () => {
        const frame = heroPhoto.closest('.hero-photo-placeholder');
        if (frame) frame.classList.add('is-fallback');
    };

    heroPhoto.addEventListener('error', showPlaceholder, { once: true });
    if (heroPhoto.complete && heroPhoto.naturalWidth === 0) showPlaceholder();
})();