console.log("Social Club 369 // Premium Brutalist Mode // ALL SYSTEMS GO");

document.addEventListener("DOMContentLoaded", () => {

    // FORZAR MODO DESKTOP EN TODOS LOS DISPOSITIVOS
    const isMobile = false; // Siempre falso = siempre modo PC
    const isLowPerfDevice = false;

    // Agregar clase desktop
    document.body.classList.add('is-desktop');
    console.log("💻 MODO PC FORZADO: Activado en todos los dispositivos");

    // 1. INICIALIZAR LENIS (SCROLL SUAVE DE LUJO) - Skip on mobile for performance
    let lenis;
    if (typeof Lenis !== 'undefined' && !isMobile) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    // Registrar GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 2. PREMIUM PRELOADER + AGE VERIFICATION
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const counterNumber = document.querySelector('.counter-number');
    const ageModal = document.getElementById('ageModal');
    const ageYes = document.getElementById('ageYes');
    const ageNo = document.getElementById('ageNo');

    // Check if already age verified
    const isAgeVerified = localStorage.getItem('ageVerified') === 'true';

    if (preloader && typeof gsap !== 'undefined') {
        const count = { value: 0 };

        const preloaderTL = gsap.timeline({
            onComplete: () => {
                preloader.classList.add('hidden');

                // Show age modal if not verified
                if (ageModal && !isAgeVerified) {
                    setTimeout(() => {
                        ageModal.classList.add('active');
                    }, 300);
                } else {
                    initAnimations();
                }
            }
        });

        if (progressBar) {
            preloaderTL.to(progressBar, {
                scaleX: 1,
                duration: 2.5,
                ease: "power2.inOut"
            }, 0);
        }

        if (counterNumber) {
            preloaderTL.to(count, {
                value: 100,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                    counterNumber.textContent = Math.floor(count.value);
                }
            }, 0);
        }

        if (progressBar) {
            preloaderTL.to(progressBar, {
                opacity: 0,
                duration: 0.3
            }, 2.3);
        }

    } else if (ageModal && !isAgeVerified) {
        // No preloader but need age verification
        ageModal.classList.add('active');
    } else {
        initAnimations();
    }

    // Age verification handlers
    if (ageYes) {
        ageYes.addEventListener('click', () => {
            localStorage.setItem('ageVerified', 'true');
            ageModal.classList.remove('active');
            ageModal.classList.add('hidden');
            initAnimations();
        });
    }

    if (ageNo) {
        ageNo.addEventListener('click', () => {
            window.location.href = 'https://www.google.es';
        });
    }

    function initAnimations() {
        // 3. EFECTO LÍQUIDO EN HERO (IRONHILL) - SKIP ON MOBILE (too heavy)
        const canvas = document.querySelector(".hero-canvas");
        if (canvas && typeof THREE !== 'undefined' && !isMobile) {
            initLiquidHero(canvas);
        } else if (canvas) {
            // Hide canvas on mobile for performance
            canvas.style.display = 'none';
        }

        // 4. STICKY CARDS EFFECT - Simplified on mobile
        if (!isMobile) {
            initStickyCards();
        } else {
            initStickyCardsMobile();
        }

        // 5. ATMOSPHERE STACKING (SENSEITECH) - Skip on mobile
        if (!isMobile) {
            initAtmosphereSection();
        }

        // 6. SCROLL REVEAL ANIMATIONS - Simplified on mobile
        initScrollReveal();

        // 7. DIVIDER ANIMATIONS
        if (!isMobile) {
            initDividers();
        }

        // 8. FAQ ACCORDION - Works on all devices
        initFAQ();
    }

    // --- MOBILE-FRIENDLY STICKY CARDS ---
    function initStickyCardsMobile() {
        const cards = document.querySelectorAll(".card");
        if (cards.length === 0) return;

        // Simple fade-in on scroll for mobile
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // --- STICKY CARDS ---
    function initStickyCards() {
        const cards = document.querySelectorAll(".card");
        const cardsWrapper = document.querySelector(".cards-wrapper");
        const introTextSticky = document.querySelector(".intro-text-sticky");

        if (cards.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

            // Pin del texto introductorio
            if (introTextSticky) {
                ScrollTrigger.create({
                    trigger: cards[0],
                    start: "top 35%",
                    endTrigger: cards[cards.length - 1],
                    end: "top 30%",
                    pin: introTextSticky,
                    pinSpacing: false,
                });
            }

            cards.forEach((card, index) => {
                const isLastCard = index === cards.length - 1;
                const cardInner = card.querySelector(".card-inner");

                if (!isLastCard) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 35%",
                        endTrigger: cardsWrapper || cards[cards.length - 1],
                        end: "bottom bottom",
                        pin: true,
                        pinSpacing: false,
                    });

                    if (cardInner) {
                        gsap.to(cardInner, {
                            y: `-${(cards.length - index) * 5}vh`,
                            scale: 0.95 + (0.01 * index),
                            ease: "none",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 35%",
                                endTrigger: cardsWrapper || cards[cards.length - 1],
                                end: "bottom bottom",
                                scrub: true,
                            },
                        });
                    }
                }
            });
        }
    }

    // --- ATMOSPHERE STACKING (SENSEITECH) ---
    function initAtmosphereSection() {
        const atmosphereSection = document.querySelector('.atmosphere-section');
        const atmosphereImages = document.querySelectorAll('.atmosphere-img');

        if (!atmosphereSection || atmosphereImages.length === 0 || typeof gsap === 'undefined') return;

        // Posiciones finales para las 4 imágenes (esquinas)
        const finalPositions = [
            [-140, -140], // Top-left
            [40, -130],   // Top-right
            [-160, 40],   // Bottom-left
            [20, 30]      // Bottom-right
        ];

        const initialRotations = [5, -3, 3.5, -1];
        const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

        ScrollTrigger.create({
            trigger: '.atmosphere-section',
            start: 'top top',
            end: `+=${window.innerHeight * 6}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                atmosphereImages.forEach((img, index) => {
                    const initialRotation = initialRotations[index];
                    const phase1Start = phaseOneStartOffsets[index];
                    const phase1End = Math.min(phase1Start + (0.45 - phase1Start) * 0.9, 0.45);

                    let x = -50;
                    let y, rotation;

                    // Phase 1: Rise up
                    if (progress < phase1Start) {
                        y = 200;
                        rotation = initialRotation;
                    } else if (progress <= 0.45) {
                        let phase1Progress;
                        if (progress >= phase1End) {
                            phase1Progress = 1;
                        } else {
                            const linearProgress = (progress - phase1Start) / (phase1End - phase1Start);
                            phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
                        }
                        y = 200 - phase1Progress * 250;
                        rotation = initialRotation;
                    } else {
                        y = -50;
                        rotation = initialRotation;
                    }

                    // Phase 2: Spread to corners
                    const phase2StartOffsets = [0.5, 0.55, 0.6, 0.65];
                    const phase2Start = phase2StartOffsets[index];
                    const phase2End = Math.min(phase2Start + (0.95 - phase2Start) * 0.9, 0.95);
                    const finalX = finalPositions[index][0];
                    const finalY = finalPositions[index][1];

                    if (progress >= phase2Start && progress <= 0.95) {
                        let phase2Progress;
                        if (progress >= phase2End) {
                            phase2Progress = 1;
                        } else {
                            const linearProgress = (progress - phase2Start) / (phase2End - phase2Start);
                            phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
                        }
                        x = -50 + (finalX + 50) * phase2Progress;
                        y = -50 + (finalY + 50) * phase2Progress;
                        rotation = initialRotation * (1 - phase2Progress);
                    } else if (progress > 0.95) {
                        x = finalX;
                        y = finalY;
                        rotation = 0;
                    }

                    gsap.set(img, {
                        transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`
                    });
                });
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    function initScrollReveal() {
        const elements = document.querySelectorAll(
            '.hero-content, .intro-box, .intro-grid, .about-text, .about-imgs, ' +
            '.event-card, .review-card, .blog-card, .faq-item, .join-text, .join-form-box, ' +
            '.contact-info, .contact-form-box'
        );

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            elements.forEach((el, index) => {
                gsap.fromTo(el,
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.98
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        delay: index * 0.05,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // Headings con efecto especial
            document.querySelectorAll('h1, h2').forEach(heading => {
                gsap.fromTo(heading,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%"
                        }
                    }
                );
            });
        }
    }

    // --- DIVIDER ANIMATIONS ---
    function initDividers() {
        const dividers = document.querySelectorAll('.divider-line');

        if (typeof gsap !== 'undefined' && dividers.length > 0) {
            dividers.forEach(divider => {
                gsap.to(divider, {
                    scaleX: 1,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: divider,
                        start: "top 80%"
                    }
                });
            });
        }
    }

    // --- FAQ ACCORDION ---
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;

                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                item.classList.toggle('active');
            });
        });
    }

    // --- LIQUID HERO EFFECT ---
    function initLiquidHero(canvas) {
        const hero = canvas.parentElement;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uProgress;
            uniform vec2 uResolution;
            uniform vec3 uColor;
            uniform float uSpread;
            varying vec2 vUv;
            
            float Hash(vec2 p) {
                vec3 p2 = vec3(p.xy, 1.0);
                return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
            }
            
            float noise(in vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f *= f * (3.0 - 2.0 * f);
                return mix(mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
                          mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x), f.y);
            }
            
            float fbm(vec2 p) {
                float v = 0.0;
                v += noise(p * 1.0) * 0.5;
                v += noise(p * 2.0) * 0.25;
                v += noise(p * 4.0) * 0.125;
                return v;
            }
            
            void main() {
                vec2 uv = vUv;
                float aspect = uResolution.x / uResolution.y;
                vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
                float dissolveEdge = uv.y - uProgress * 0.6;
                float noiseValue = fbm(centeredUv * 12.0);
                float d = dissolveEdge + noiseValue * uSpread;
                float pixelSize = 1.0 / uResolution.y;
                float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
                gl_FragColor = vec4(uColor, alpha * 0.85);
            }
        `;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        const liquidColor = new THREE.Vector3(0.0, 0.94, 1.0);
        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uProgress: { value: 0 },
                uResolution: { value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight) },
                uColor: { value: liquidColor },
                uSpread: { value: 0.5 },
            },
            transparent: true,
        });

        function resize() {
            renderer.setSize(hero.offsetWidth, hero.offsetHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight);
        }

        window.addEventListener("resize", resize);

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let scrollProgress = 0;

        function animate() {
            material.uniforms.uProgress.value = scrollProgress;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();
        resize();

        window.addEventListener("scroll", () => {
            scrollProgress = Math.min((window.scrollY / (hero.offsetHeight * 1.5)) * 1.2, 1.2);
        });
    }

    // --- HEADER SCROLL BEHAVIOR ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener("scroll", () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                navbar.style.backgroundColor = "rgba(0,0,0,0.98)";
                navbar.style.boxShadow = "0 5px 30px rgba(0,0,0,0.5)";
            } else {
                navbar.style.backgroundColor = "rgba(0,0,0,0.9)";
                navbar.style.boxShadow = "none";
            }

            lastScrollTop = scrollTop;
        });
    }

    // --- CONTACT SPOTLIGHT EFFECT ---
    const spotlightEl = document.querySelector('#spotlight-section');
    if (spotlightEl) {
        const pos = {
            target: { x: 0, y: 0 },
            current: { x: 0, y: 0 }
        };

        spotlightEl.addEventListener('mousemove', (e) => {
            const rect = spotlightEl.getBoundingClientRect();
            pos.target.x = e.clientX - rect.left;
            pos.target.y = e.clientY - rect.top;
        });

        // Smooth lerp animation
        function animateSpotlight() {
            pos.current.x += (pos.target.x - pos.current.x) * 0.1;
            pos.current.y += (pos.target.y - pos.current.y) * 0.1;

            spotlightEl.style.setProperty('--mouse-x', `${pos.current.x}px`);
            spotlightEl.style.setProperty('--mouse-y', `${pos.current.y}px`);

            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }
});
