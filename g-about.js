import {gsap} from "gsap";
import Splitting from "splitting";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {Clock, LinearSRGBColorSpace, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";


gsap.registerPlugin(ScrollTrigger);


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
new Global(document.querySelector('.page-wrapper'));

export class About{
    constructor(container) {
        this.container = container;
        this.scrollWrapper = this.container.querySelector('.about-v-wrapper');
        this.scrollContainer = this.container.querySelector('.about-v');
        this.viewerNote = this.container.querySelector('.ar-viewer-note');
        this.viewerImg = this.container.querySelector('.ar-viewer-img');
        this.init();
    }

    init(){
        this.initMarquee();
        this.initHorScroll();
        this.initARScene();
    }


    initMarquee(){
        this.marquee1 = this.container.querySelector('.ab-h-top');
        this.marquee2 = this.container.querySelector('.ab-h-btm');
        this.setupHorizontalLoop(this.marquee1, true);
        this.setupHorizontalLoop(this.marquee2, false);
    }

    setupHorizontalLoop(marquee, reverse = false) {
        const items = [...marquee.querySelectorAll('.ab-h-grid')];
        const loop = horizontalLoop(items, {
            paused: false,
            repeat: -1,
            speed: window.innerWidth < 768 ? 0.32 : 0.85,
            reversed: reverse
        });



        return loop;
    }


    getScrollAmount() {
        this.scrollWidth = this.scrollContainer.scrollWidth;
        return -(this.scrollWidth - window.innerWidth);
    }

    initHorScroll() {
        let mm = gsap.matchMedia();
        mm.add("(min-width: 800px)", () => {
            let horScroll = gsap.to(this.scrollContainer, {
                x: () => this.getScrollAmount(),
                scrollTrigger: {
                    trigger: this.scrollWrapper,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${this.getScrollAmount() * -1}`,
                    invalidateOnRefresh: true,
                }
            });

            const aboutC = this.container.querySelector('.about-c');
            const tl = gsap.timeline()
            tl.from('.about-c-img', {
                scale: 0,
                duration: 5,
                ease: "expo.out",
                scrollTrigger: {
                    containerAnimation: horScroll,
                    trigger: aboutC,
                    start: "0% right",
                    //end: "82% center",
                    toggleActions: "play none none reverse",
                    scrub: 1,
                    //markers: true,
                },
            })

            const tl2 = gsap.timeline()
            tl2.fromTo(aboutC.querySelectorAll('.char'),{yPercent:110}, {
                yPercent: 0,
                duration:1,
                overwrite: true,
                ease: "expo.out",
                scrollTrigger: {
                    containerAnimation: horScroll,
                    trigger: aboutC,
                    start: "0% 80%",
                    //end: "82% center",
                    toggleActions: "play none none reverse",
                    scrub: 1,
                    //markers: true,
                },
            })
        });

    }



    initARScene(){
        this.viewerNote.addEventListener('mouseenter', () => {
            gsap.to(this.viewerImg, {opacity: 1, duration: 0.5, ease: "power2.out"});
        });
        this.viewerNote.addEventListener('mousemove', (e) => {
            gsap.to(this.viewerImg, {x:e.clientX/35, duration: 0.5, ease: "power2.out"});
        });
        this.viewerNote.addEventListener('mouseleave', () => {
            gsap.to(this.viewerImg, {opacity: 0, duration: 0.5, ease: "power2.out"});
        });
        /**
         * Base
         */

            // Canvas
        const canvas = document.querySelector(".webgl-ar");

        // Scene
        const scene = new Scene();

        /**
         * Loader
         */
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            "https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/"
        );

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        /**
         *
         * Models
         */

        let kim = null;

        gltfLoader.load(
            "https://cdn.jsdelivr.net/gh/theNkennaAmadi/videos@main/kim-AR-comp.glb",
            (gltf) => {
                kim = gltf.scene;

                kim.scale.set(0.4, 0.4, 0.4);
                kim.position.set(0, 0, 0);
                kim.exposure = 1;
                scene.add(kim);
            }
        );



        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth > 768 ? window.innerWidth : window.innerWidth*0.85,
            height: window.innerWidth > 768 ? window.innerHeight : window.innerWidth * 0.85,
        };

        window.addEventListener("resize", () => {
            // Update sizes
            sizes.width = window.innerWidth > 768 ? window.innerWidth : window.innerWidth*0.85;
            sizes.height = window.innerWidth > 768 ? window.innerHeight : window.innerWidth * 0.85;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        /**
         * Camera
         */
            // Base camera
        const camera = new PerspectiveCamera(
                75,
                sizes.width / sizes.height,
                0.1,
                100
            );
        camera.position.set(0, 0.5, 1);
        scene.add(camera);


        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.target.y = 0.5
        controls.enableZoom = false
        controls.enableDamping = true

        /**
         * Renderer
         */
        const renderer = new WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.outputColorSpace = LinearSRGBColorSpace;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /**
         * Environment map
         * @type {PMREMGenerator}
         */

        let pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        const neutralEnvironment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
        scene.environment = neutralEnvironment


        /**
         * Animate
         */
        const clock = new Clock();
        let previousTime = 0;

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;



            // Update controls
            controls.update();

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        };

        tick();

    }

}

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, {x: 0});
    totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
            .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}
new About(document.querySelector('.page-wrapper'));