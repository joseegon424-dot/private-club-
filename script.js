console.log("Social Club 369 // FORCE PC MODE // READY");

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. MENTIRA AL NAVEGADOR (SIEMPRE ES PC) ---
    const isMobile = false;

    // Forzamos clases de escritorio
    document.body.classList.remove('is-mobile');
    document.body.classList.add('is-desktop');
    console.log("💻 MODO PC FORZADO: Activado en todos los dispositivos");

    // --- 2. LENIS: SCROLL RÁPIDO (SIN LAG) ---
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 0.5,        /* VELOCIDAD RÁPIDA (ANTES ERA 1.2) */
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.5, /* SCROLL MÁS REACTIVO */
            touchMultiplier: 2.5, /* DEDO MÁS ÁGIL */
            infinite: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Conectar con GSAP ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- 3. PRELOADER Y VERIFICACIÓN DE EDAD ---
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const counterNumber = document.querySelector('.counter-number');
    const ageModal = document.getElementById('ageModal');
    const ageYes = document.getElementById('ageYes');
    const ageNo = document.getElementById('ageNo');

    const isAgeVerified = localStorage.getItem('ageVerified') === 'true';

    // Animación de Preloader
    if (preloader && typeof gsap !== 'undefined') {
        const count = { value: 0 };
        const preloaderTL = gsap.timeline({
            onComplete: () => {
                preloader.classList.add('hidden');
                if (ageModal && !isAgeVerified) {
                    setTimeout(() => ageModal.classList.add('active'), 300);
                } else {
                    initAnimations();
                }
            }
        });

        if (progressBar) preloaderTL.to(progressBar, { scaleX: 1, duration: 2.0, ease: "power2.inOut" }, 0);
        if (counterNumber) {
            preloaderTL.to(count, {
                value: 100, duration: 2.0, ease: "power2.out",
                onUpdate: () => counterNumber.textContent = Math.floor(count.value)
            }, 0);
        }
        if (progressBar) preloaderTL.to(progressBar, { opacity: 0, duration: 0.3 }, 1.8);
    } else {
        if (ageModal && !isAgeVerified) ageModal.classList.add('active');
        else initAnimations();
    }

    // Botones de edad
    if (ageYes) {
        ageYes.addEventListener('click', () => {
            localStorage.setItem('ageVerified', 'true');
            ageModal.classList.remove('active');
            initAnimations();
        });
    }
    if (ageNo) ageNo.addEventListener('click', () => window.location.href = 'https://www.google.es');

    // --- 4. FUNCIÓN MAESTRA DE ANIMACIONES ---
    function initAnimations() {
        console.log("🚀 Iniciando animaciones Desktop...");

        // A. HERO LÍQUIDO
        const canvas = document.querySelector(".hero-canvas");
        if (canvas && typeof THREE !== 'undefined') initLiquidHero(canvas);

        // B. STICKY CARDS (Modo PC Siempre)
        initStickyCards();

        // C. ATMOSFERA (Senseitech)
        initAtmosphereSection();

        // D. REVEAL AL SCROLL
        initScrollReveal();

        // E. ACORDEÓN FAQ
        initFAQ();
    }

    // --- FUNCIONES ESPECÍFICAS ---

    function initStickyCards() {
        const cards = document.querySelectorAll(".card");
        const cardsWrapper = document.querySelector(".cards-wrapper");
        const introTextSticky = document.querySelector(".intro-text-sticky");

        if (cards.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Pin del texto izquierdo
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

            // Animación de tarjetas apilándose
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

    function initAtmosphereSection() {
        const atmosphereImages = document.querySelectorAll('.atmosphere-img');
        if (atmosphereImages.length === 0 || typeof gsap === 'undefined') return;

        // Coordenadas exactas Senseitech
        const finalPositions = [[-140, -140], [40, -130], [-160, 40], [20, 30]];
        const initialRotations = [5, -3, 3.5, -1];
        const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

        ScrollTrigger.create({
            trigger: '.atmosphere-section',
            start: 'top top',
            end: `+=${window.innerHeight * 4}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                atmosphereImages.forEach((img, index) => {
                    const initialRotation = initialRotations[index];
                    const phase1Start = phaseOneStartOffsets[index];
                    const phase1End = Math.min(phase1Start + (0.45 - phase1Start) * 0.9, 0.45);
                    let x = -50, y, rotation;

                    // Fase 1: Subida
                    if (progress < phase1Start) { y = 200; rotation = initialRotation; }
                    else if (progress <= 0.45) {
                        let p1 = (progress - phase1Start) / (phase1End - phase1Start);
                        p1 = p1 > 1 ? 1 : (1 - Math.pow(1 - p1, 3));
                        y = 200 - p1 * 250; rotation = initialRotation;
                    } else { y = -50; rotation = initialRotation; }

                    // Fase 2: Explosión
                    const phase2Start = [0.5, 0.55, 0.6, 0.65][index];
                    const phase2End = Math.min(phase2Start + (0.95 - phase2Start) * 0.9, 0.95);
                    const finalX = finalPositions[index][0];
                    const finalY = finalPositions[index][1];

                    if (progress >= phase2Start && progress <= 0.95) {
                        let p2 = (progress - phase2Start) / (phase2End - phase2Start);
                        p2 = p2 > 1 ? 1 : (1 - Math.pow(1 - p2, 3));
                        x = -50 + (finalX + 50) * p2;
                        y = -50 + (finalY + 50) * p2;
                        rotation = initialRotation * (1 - p2);
                    } else if (progress > 0.95) {
                        x = finalX; y = finalY; rotation = 0;
                    }

                    gsap.set(img, { transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)` });
                });
            }
        });
    }

    function initScrollReveal() {
        const elements = document.querySelectorAll('.hero-content, .intro-box, .about-text, .event-card, .review-card, .blog-card');
        if (typeof gsap !== 'undefined') {
            elements.forEach((el, index) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 0.8,
                        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
                    }
                );
            });
        }
    }

    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const item = q.parentElement;
                document.querySelectorAll('.faq-item').forEach(i => i !== item && i.classList.remove('active'));
                item.classList.toggle('active');
            });
        });
    }

    // --- LIQUID HERO (Versión Optimizada) ---
    function initLiquidHero(canvas) {
        const hero = canvas.parentElement;
        const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
        const fragmentShader = `
            uniform float uProgress; uniform vec2 uResolution; uniform vec3 uColor;
            varying vec2 vUv;
            float Hash(vec2 p) { vec3 p2 = vec3(p.xy, 1.0); return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123); }
            float noise(in vec2 p) { vec2 i = floor(p); vec2 f = fract(p); f *= f * (3.0 - 2.0 * f); return mix(mix(Hash(i), Hash(i + vec2(1.0, 0.0)), f.x), mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x), f.y); }
            void main() {
                vec2 uv = vUv; float aspect = uResolution.x / uResolution.y;
                float noiseValue = noise((uv - 0.5) * vec2(aspect, 1.0) * 12.0);
                float alpha = 1.0 - smoothstep(-0.01, 0.01, (uv.y - uProgress * 0.6) + noiseValue * 0.5);
                gl_FragColor = vec4(uColor, alpha * 0.85);
            }
        `;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        const material = new THREE.ShaderMaterial({
            vertexShader, fragmentShader,
            uniforms: { uProgress: { value: 0 }, uResolution: { value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight) }, uColor: { value: new THREE.Vector3(0.0, 0.94, 1.0) } },
            transparent: true,
        });
        function resize() { renderer.setSize(hero.offsetWidth, hero.offsetHeight); material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight); }
        window.addEventListener("resize", resize);
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);
        function animate() { material.uniforms.uProgress.value = Math.min((window.scrollY / (hero.offsetHeight * 1.5)) * 1.2, 1.2); renderer.render(scene, camera); requestAnimationFrame(animate); }
        animate(); resize();
    }
});
