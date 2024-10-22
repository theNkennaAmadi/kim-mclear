import { gsap } from "gsap";
import Splitting from "splitting";
import ScrollTrigger from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export class Global {
    constructor(container) {
        this.container = container;
        this.header = this.container.querySelector('header');
        this.footer = this.container.querySelector('footer');
        this.init();
    }

    init() {
        this.splitText();
        this.mobileNavAnimation();
        gsap.to(this.container.querySelectorAll('header, main, footer'), { duration: 0.5, opacity: 1 });
    }


    splitText() {
        // Select all elements that need to be split
        let elementsToSplit = Array.from(this.container.querySelectorAll('h1:not([no-split]), h2:not([no-split]), h3:not([no-split]), p:not([no-split]), a:not([no-split])'));

        // Filter out elements that are descendants of other elements in the list
        this.elementsToSplit = elementsToSplit.filter(element => {
            return !elementsToSplit.some(otherElement => otherElement !== element && otherElement.contains(element));
        });

        this.elementsToSplit.forEach((element) => {
            const originalText = element.textContent.trim();
            element.setAttribute('aria-label', originalText);

            const result = Splitting({
                target: element,
                by: 'chars'
            });

            const words = result[0].words;
            const chars = result[0].chars;

            words.forEach((word) => {
                word.setAttribute('aria-hidden', 'true');
            });

            chars.forEach((char) => {
                char.setAttribute('aria-hidden', 'true');
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
                gsap.set(chars, { yPercent: 110, opacity: 0 });
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: element,
                        start: "top 92%",
                        end: "bottom bottom",
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

}