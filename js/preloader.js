(() => {
    const preloader = document.querySelector('[data-preloader]');
    if (!preloader || !document.body) return;

    const minimumDisplayTime = 4000;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const appRegions = Array.from(document.querySelectorAll('body > header, body > main, body > footer'));
    const previousStates = appRegions.map(region => ({
        region,
        inert: region.inert,
        ariaHidden: region.getAttribute('aria-hidden')
    }));

    document.body.classList.add('preloader-active');
    appRegions.forEach(region => {
        region.inert = true;
        region.setAttribute('aria-hidden', 'true');
    });

    const pageLoaded = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
    const minimumTimePassed = new Promise(resolve => window.setTimeout(resolve, minimumDisplayTime));

    Promise.all([pageLoaded, minimumTimePassed]).then(() => {
        preloader.classList.add('is-hiding');
        const fadeDuration = reduceMotion?.matches ? 0 : 600;

        window.setTimeout(() => {
            previousStates.forEach(({ region, inert, ariaHidden }) => {
                region.inert = inert;
                if (ariaHidden === null) region.removeAttribute('aria-hidden');
                else region.setAttribute('aria-hidden', ariaHidden);
            });
            document.body.classList.remove('preloader-active');
            preloader.remove();
        }, fadeDuration);
    });
})();
