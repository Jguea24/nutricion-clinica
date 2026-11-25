(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const selectors = [
        '.hero-content',
        '.hero-visual',
        '.services-heading',
        '.service-card',
        '.about-visual',
        '.about-content',
        '.methodology-heading',
        '.methodology-steps > li',
        '.methodology-cta',
        '.blog-heading',
        '.blog-card',
        '.blog-cta',
        '.footer-column',
        '.footer-bottom-inner'
    ];
    const elements = document.querySelectorAll(selectors.join(','));
    if (!elements.length) return;

    elements.forEach(element => element.classList.add('js-reveal'));
    document.documentElement.classList.add('js-reveal-ready');

    const staggerGroups = ['.service-card', '.methodology-steps > li', '.blog-card', '.footer-column'];
    staggerGroups.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 240)}ms`);
        });
    });

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            activeObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
    });

    elements.forEach(element => observer.observe(element));
})();
