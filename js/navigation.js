(() => {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        menu.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
        menu.classList.toggle('is-open', !isOpen);
    });

    const desktopLayout = window.matchMedia('(min-width: 981px)');
    const resetForDesktop = event => {
        if (event.matches) closeMenu();
    };
    if (desktopLayout.addEventListener) {
        desktopLayout.addEventListener('change', resetForDesktop);
    } else {
        desktopLayout.addListener(resetForDesktop);
    }

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
})();
