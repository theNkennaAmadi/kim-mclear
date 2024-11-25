import {gsap} from "gsap";

import Splitting from "splitting";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";


gsap.registerPlugin(ScrollTrigger);

gsap.config({
    nullTargetWarn: false,
});

console.log('home')

export class Global {
    constructor(container) {
        this.container = container;
        this.header = this.container.querySelector('header');
        this.footer = this.container.querySelector('footer');
        this.nav = this.container.querySelector('nav');
        this.navMenu = this.container.querySelector('.nav-menu');
        this.navDropdown = this.container.querySelector('.nav-dropdown');
        this.init();

    }

    init() {
        this.splitText();
        gsap.to(this.container.querySelectorAll('header, main, footer'), {duration: 0.5, opacity: 1});
        this.menuAnimation();
        this.updateFooterYear();
        this.initFooter();
    }


    splitText() {
        // Select all elements that need to be split
        let elementsToSplit = Array.from(this.container.querySelectorAll('h1:not([no-split]), h2:not([no-split]), h3:not([no-split]), p:not([no-split]), a:not([no-split]), label:not([no-split]) span:not([no-split]) blockquote:not([no-split])'));

        // Filter out elements that are descendants of other elements in the list
        this.elementsToSplit = elementsToSplit.filter(element => {
            return !elementsToSplit.some(otherElement => otherElement !== element && otherElement.contains(element));
        });


        this.elementsToSplit.forEach((element) => {

            const result = Splitting({
                target: element,
                by: 'chars'
            });

        });
        this.setupTextAnimations();
    }


    setupTextAnimations() {
        this.elementsToSplit.forEach(element => {
            const chars = element.querySelectorAll('.char');
            const animationType = element.getAttribute('split-text');
            const noScroll = element.hasAttribute('no-scroll');

            if (!noScroll) {
                gsap.set(chars, {yPercent: 110, opacity: 0});
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: element,
                        start: "top 92%",
                        end: "bottom bottom",
                        invalidateOnRefresh: true,
                    }
                });

                if (animationType === 'chars') {
                    tl.to(chars, {
                        yPercent: 0,
                        stagger: {
                            each: 0.05
                        },
                        opacity: 1,
                        ease: 'power4.inOut',
                        duration: 1,
                    });
                } else if (animationType === 'intro') {
                    //gsap.set(chars, {scale: 0})
                    tl.to(chars, {
                        yPercent: 0,
                        opacity: 1,
                        delay: 1,
                        //scale:1,
                        //ease: 'expo.out',
                        stagger: {
                            each: 0.05,
                            from: 'center',
                        }
                    })
                } else {
                    tl.to(chars, {
                        yPercent: 0,
                        opacity: 1,
                        ease: 'expo.out',
                        duration: 2
                    });
                }
            }
        });
    }

    menuAnimation() {
        //gsap.set(this.navDropdown, {height: '0px'});
        const tl = gsap.timeline({paused: true});
        tl.to('.nav-menu-bar', {y: '0px', scale: 0.8})
            .to('.nav-menu-bar.top', {rotate: 45, duration: 0.5}, "<")
            .to('.nav-menu-bar.btm', {rotate: -45, duration: 0.5}, "<")
            .to(this.navDropdown, {height: '5.5rem'}, "<")
            .from(this.navDropdown.querySelectorAll('.word'), {y: '100%', opacity: 0, stagger: 0.1}, "<");

        this.menuOpen = false;

        this.navMenu.addEventListener('click', () => {
            this.menuOpen ? tl.reverse() : tl.play();
            this.menuOpen = !this.menuOpen;
        })

        this.container.querySelectorAll('.text-link').forEach(link => {
            const tl = gsap.timeline({paused: true});
            const words = [...link.querySelectorAll('.word')];
            tl.to(words.at(-1), {x: '30%', duration: 0.5})
            tl.to(words.at(-1).querySelectorAll('.char'), {y: '-1.5ch', x: '1.5ch', duration: 0.5}, "<0.1")


            link.addEventListener('mouseenter', () => {
                tl.play();
            });
            link.addEventListener('mouseleave', () => {
                tl.reverse();
            });
        });
    }

    updateFooterYear() {
        const currentYear = new Date().getFullYear();
        this.footer.querySelector('.footer-year').textContent = `Copyright © ${currentYear} Kim McLear. All Rights Reserved.`;
    }

    initFooter() {
        // Canvas
        const canvas = this.container.querySelector(".webgl1");

        // Scene
        const scene = new THREE.Scene();

        // Loaders
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/");

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        // Store all mixers
        const mixers = [];

        // Animate individual dove
        const animateDove = (dove, index) => {
            const startDelay = index * 0.5; // Stagger start times
            const duration = 12 + (Math.random() * 10); // Random duration between 12-22 seconds

            gsap.timeline({ repeat: -1, delay: startDelay })
                .to(dove.position, {
                    x: 3,
                    z: 0,
                    duration: duration / 2,
                    ease: "none"
                })
                .to(dove.rotation, {
                    y: -1.25,
                    duration: 2
                }, "-=2") // Start rotation 2 seconds before the position ends
                .to(dove.position, {
                    x: -5,
                    z: -1,
                    duration: duration / 2,
                    ease: "none"
                })
                .to(dove.rotation, {
                    y: 1.25,
                    duration: 2
                }, "-=2"); // Start rotation 2 seconds before the position ends
        };

        // Load dove model once
        gltfLoader.load(
            "https://cdn.jsdelivr.net/gh/theNkennaAmadi/emil-about@main/dist/models/dove/dove-c.glb",
            (gltf) => {
                const originalDove = gltf.scene;
                const animationClip = gltf.animations[0];

                // Create multiple doves by cloning
                for (let i = 0; i < 10; i++) {
                    // Clone the dove model
                    const dove = clone(originalDove);
                    dove.scale.set(0.4, 0.4, 0.4);

                    // Set different starting positions for each dove
                    dove.position.set(
                        -5 + (i * 2), // Spread doves horizontally
                        Math.random() * 2.2, // Vary height slightly
                        -1 + (Math.random() * 2) // Vary depth
                    );

                    dove.rotation.y = 1.25;
                    scene.add(dove);

                    // Setup animation mixer
                    const mixer = new THREE.AnimationMixer(dove);
                    const action = mixer.clipAction(animationClip);
                    action.setDuration(1.25).play();

                    mixers.push(mixer);

                    // Create unique animation for this dove
                    animateDove(dove, i);
                }
            }
        );

        // Lights
        scene.add(new THREE.AmbientLight("white", 1));

        // Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0, 0.55, 2);
        scene.add(camera);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Resize handler
        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Animation loop
        const clock = new THREE.Clock();

        const tick = () => {
            const deltaTime = clock.getDelta();

            // Update all mixers
            mixers.forEach(mixer => mixer.update(deltaTime));

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };

        tick();
    }





}



export class Home{
    constructor(container) {
        this.container = container;
        this.init();
    }

    init(){
        // console.log('Home');
        this.featuredLogosReveal();
        this.introImgReveal();
        new DotAnimation(this.container, 'canvasDot');
    }

    introImgReveal(){
        this.introVisual = this.container.querySelector('.intro-visual');
        gsap.from(this.introVisual, {clipPath: 'inset(0% 0% 100% 0%)', ease: "expo.inOut", duration: 2});
        gsap.from(this.introVisual.querySelector('img'), { scale: 1.3, ease: "expo.out", duration: 2, delay: 0.75});
    }

    featuredLogosReveal(){
        this.featuredLogosList = document.querySelector('.featured-logos-list');
        this.featuredLogos = document.querySelectorAll('.featured-logo-item');
        gsap.from(this.featuredLogos, {opacity:0,scale: 0,
            ease: 'expo.out',
            duration: 1.5,
            delay: 0.1,
            stagger: 0.2,
            scrollTrigger:{
                trigger: this.featuredLogosList,
                start: 'top 90%',
            }});
    }
}

class DotAnimation {
    constructor(container, canvasID, config = {}) {
        // Configuration with defaults
        this.config = {
            width: window.innerWidth,
            height: window.innerHeight,
            dotSmall: 2,
            dotLarge: 15,
            hoverRadius: 45,
            normalColor: '#371f04',
            hoverColor: '#bf911d',
            ...config
        };

        // Canvas setup
        this.canvas = container.querySelector(`#${canvasID}`);
        this.mainContainer = this.canvas.parentElement.parentElement;
        this.ctx = this.canvas.getContext('2d');

        // State variables
        this.dots = [];
        this.mousePosition = { x: null, y: null };
        this.resizeTimer = null;

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleResize = this.handleResize.bind(this);

        // Initialize
        this.setupEventListeners();
        this.resizeCanvas();
        this.init();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseout', this.handleMouseOut);
        window.addEventListener('resize', this.handleResize);
    }

    handleMouseMove(e) {
        this.mousePosition.x = e.offsetX;
        this.mousePosition.y = e.offsetY;
    }

    handleMouseOut() {
        this.mousePosition.x = null;
        this.mousePosition.y = null;
    }

    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.resizeCanvas();
            this.init();
        }, 250);
    }

    resizeCanvas() {
        const { dotLarge } = this.config;

        // Set canvas size
        this.config.width = window.innerWidth;
        this.config.height = window.innerHeight;
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        // Update grid calculations
        this.numRows = Math.ceil(this.config.height / (dotLarge * 2)) + 1;
        this.numCols = Math.ceil(this.config.width / (dotLarge * 2));
        this.numDots = this.numRows * this.numCols;
    }

    createDot(x, y) {
        return {
            radius: this.config.dotSmall,
            x,
            y,
            originalX: x,
            originalY: y,
            inHoverRadius: false,
        };
    }

    init() {
        this.dots = [];
        const { height: ch, width: cw, dotLarge } = this.config;

        // Calculate center coordinates
        const centerX = cw / 2;
        const centerY = ch / 2;

        // Create dots and calculate stagger based on distance from center
        for (let row = dotLarge; row <= ch; row += dotLarge * 2) {
            for (let col = dotLarge; col <= cw; col += dotLarge * 2) {
                const dot = this.createDot(col, row);

                // Calculate the distance of each dot from the center
                const dx = centerX - col;
                const dy = centerY - row;
                dot.staggerDelay = Math.sqrt(dx * dx + dy * dy) * 0.0025; // Adjust 0.005 for desired speed

                this.dots.push(dot);
            }
        }

        // Animate dots with stagger based on distance from center
        gsap.from(this.dots, {
            duration: 1,
            radius: 0,
            stagger: (index, target) => target.staggerDelay, // Custom stagger per dot
            ease: "expo.out" // Smooth "pop-in" effect
        });

        this.draw();
    }


    updateDot(dot) {
        const { normalColor, hoverColor, hoverRadius } = this.config;
        const { x, y, originalX, originalY } = dot;

        // Draw the dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, dot.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = dot.inHoverRadius ? hoverColor : normalColor;
        this.ctx.fill();
        this.ctx.closePath();

        // Check proximity
        if (this.mousePosition.x && this.mousePosition.y) {
            const dX = originalX - this.mousePosition.x;
            const dY = originalY - this.mousePosition.y;
            const dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));

            if (dist <= hoverRadius) {
                dot.inHoverRadius = true;
                gsap.to(dot, {
                    duration: 0.4,
                    x: this.mousePosition.x,
                    y: this.mousePosition.y
                });
            } else {
                dot.inHoverRadius = false;
                gsap.to(dot, {
                    duration: 0.4,
                    x: originalX,
                    y: originalY
                });
            }
        } else {
            dot.inHoverRadius = false;
            gsap.to(dot, {
                duration: 0.4,
                x: originalX,
                y: originalY
            });
        }
    }

    draw = () => {
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);

        // Update all dots
        this.dots.forEach(dot => this.updateDot(dot));

        // Request next frame
        requestAnimationFrame(this.draw);
    }

    // Clean up method
    destroy() {
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseout', this.handleMouseOut);
        window.removeEventListener('resize', this.handleResize);
        gsap.killTweensOf(this.dots);
    }
}

window.addEventListener('load', () => {
    new Global(document.querySelector('.page-wrapper'));
    new Home(document.querySelector('.page-wrapper'));
});