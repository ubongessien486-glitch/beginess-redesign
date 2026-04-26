document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll Progress Bar ───────────────────────────────────────────────────
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const total = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / total) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, { passive: true });
    }

    // ── Navbar: scroll shadow + hide on scroll down, show on scroll up ────────
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            navbar.classList.toggle('scrolled', currentY > 30);
            lastScrollY = currentY;
        }, { passive: true });
    }

    // ── IntersectionObserver for all reveal classes ───────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale'
    ).forEach(el => revealObserver.observe(el));

    // ── Checklist stagger reveal ──────────────────────────────────────────────
    const checklistObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                checklistObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.checklist').forEach(list => {
        checklistObserver.observe(list);
    });

    // ── Mobile Menu Toggle (full-screen overlay) ──────────────────────────────
    const mobileToggle = document.getElementById('mobileToggle');
    const navList = document.getElementById('navList');
    const navActions = document.getElementById('navActions');

    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            if (navActions) navActions.classList.toggle('open', isOpen);
            mobileToggle.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on nav link click
        document.querySelectorAll('.nav-link, .btn-primary').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                if (navActions) navActions.classList.remove('open');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }

    // ── Magnetic Buttons (Apple-style attract-to-cursor) ─────────────────────
    document.querySelectorAll('.hover-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ── 3D tilt on service hero images ───────────────────────────────────────
    document.querySelectorAll('.service-visual-wrap').forEach(wrap => {
        const img = wrap.querySelector('img');
        if (!img) return;
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            img.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.03)`;
        });
        wrap.addEventListener('mouseleave', () => {
            img.style.transform = 'rotateY(-6deg) rotateX(3deg) scale(1)';
        });
    });

    // ── Feature List Tabs ─────────────────────────────────────────────────────
    const featureItems = document.querySelectorAll('#featureList li');
    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            featureItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // ── Active nav link based on current page ─────────────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) link.classList.add('active');
    });

    // ── Smooth counter animation for any .count-up elements ──────────────────
    const countUp = (el, target, duration = 1500) => {
        let start = 0;
        const startTime = performance.now();
        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            el.textContent = Math.floor(ease * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                countUp(el, parseInt(el.dataset.target, 10));
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

});
