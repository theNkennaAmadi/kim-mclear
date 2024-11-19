import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Clock,
    LinearSRGBColorSpace,
    PMREMGenerator
} from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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