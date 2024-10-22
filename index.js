import 'lenis/dist/lenis.css'
import 'splitting/dist/splitting.css'

import {gsap} from "gsap";
import barba from "@barba/core";
import Lenis from 'lenis'
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Observer} from "gsap/Observer";
import {resetWebflow} from "./js/utils.js";
import {Global} from "./js/global.js";
import {Home} from "./js/home.js";
import {About} from "./js/about.js";
import {Contact} from "./js/contact.js";
import {Speaking} from "./js/speaking.js";
import {Media} from "./js/media.js";
import {NotFound} from "./js/not-found.js";
import {Studio} from "./js/studio.js";
import {Books} from "./js/books.js";



// Initialize Lenis smooth scrolling
const lenis = new Lenis({ smooth: true });
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

gsap.config({
    nullTargetWarn: false,
});

// Barba.js hooks and page transition management
barba.hooks.beforeLeave((data) => {
    // Kill ScrollTrigger instances
    ScrollTrigger.killAll()
    Observer.getAll((o) => o.kill());

    // Kill GSAP tweens
    gsap.getTweensOf(data.current.container.querySelectorAll('*')).forEach((tween) => {
        tween.revert();
        tween.kill();
    });

    ScrollTrigger.clearScrollMemory();
});

barba.hooks.enter((data) => {
    lenis.stop();
    //gsap.set([ data.current.container], {  top: 0, left: 0, width: "100%", height:'100vh' });
    gsap.set([data.next.container], { position: "fixed", zIndex:100, top: 0, left: 0, width: "100%", height:'100vh' });
});

barba.hooks.after((data) => {
    lenis.start();
    gsap.set(data.next.container, { position: "relative", height: "auto", clearProps: "all" });
    resetWebflow(data);
    ScrollTrigger.refresh();
});


let firstLoad = false;

// Barba.js initialization
barba.init({
    preventRunning: true,
    views: [
        {
            namespace: "home",
            afterEnter(data) {
                if (firstLoad && !sessionStorage.getItem("firstLoad")) {
                    firstLoad = false;
                } else {
                    new Global(data.next.container);
                    new Home(data.next.container);
                }
            }
        },
        {
            namespace: "about",
            afterEnter(data) {
                new Global(data.next.container);
                new About(data.next.container);
            },
        },
        {
            namespace: "contact",
            afterEnter(data) {
                new Global(data.next.container);
                new Contact(data.next.container);
            },
        },
        {
            namespace: "speaking",
            afterEnter(data) {
                new Global(data.next.container);
                new Speaking(data.next.container);
            },
        },
        {
            namespace: "media",
            afterEnter(data) {
                new Global(data.next.container);
                new Media(data.next.container);
            },
        },
        {
            namespace: "studio",
            afterEnter(data) {
                new Global(data.next.container);
                new Studio(data.next.container);
            },
        },
        {
            namespace: "books",
            afterEnter(data) {
                new Global(data.next.container);
                new Books(data.next.container);
            },
        },
        {
            namespace: "not-found",
            afterEnter(data) {
                new NotFound(data.next.container);
            },
        },

    ],
    transitions: [
        {
            sync: true,
            enter(data) {
                const nextContainer = data.next.container;
                const currentContainer = data.current.container;
                let tlTransition = gsap.timeline({defaults: {ease: "expo.out", onComplete: () => {ScrollTrigger.refresh();}}});
                tlTransition.to(currentContainer.querySelector(".page-transition"), {opacity: 1, duration: 1}, "<")
                tlTransition.to(currentContainer.querySelector(".page-wrap-content"), {y: '-20vh', duration: 1}, "<")
                tlTransition.from(nextContainer.querySelector(".page-wrap-content"), {clipPath: 'inset(100% 0% 0% 0%)', zIndex: 10, duration: 1}, "<")
                return tlTransition;
            }
        }
    ]
});