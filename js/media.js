import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Draggable } from "gsap/Draggable";


export class Media{
    constructor(container) {
        this.container = container;
        this.init();
    }

    init(){
        console.log('Media');
        this.introImgReveal()
        this.featuredLogosReveal()
        this.pressItemsReveal()

    }

    introImgReveal(){
        this.introVisual = this.container.querySelector('.media-hero-img');
        gsap.from(this.introVisual, {clipPath: 'inset(0% 0% 100% 0%)', ease: "expo.inOut", duration: 3});
        gsap.from(this.introVisual.querySelector('img'), { scale: 1.3, ease: "expo.out", duration: 3, delay: 0.4});
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
                start: 'top 80%',
            }});
    }

    pressItemsReveal(){
        this.pressItems = document.querySelectorAll('.press-item');
        this.pressItems.forEach(item=>{
            const viewElement = item.querySelector('.view-box');
            item.addEventListener('mouseenter', ()=>{
               gsap.to(viewElement, {opacity:1,
                   ease: 'expo.out',
                   duration: 1.4,

               });
            })
            item.addEventListener('mouseleave', ()=> {
                gsap.to(viewElement, {opacity:0,
                    ease: 'expo.out',
                    overwrite: true,
                    duration: 0.2,
                });
            })

            item.addEventListener('mousemove', (event) => {
                // Get the dimensions and position of the parent container
                const pressRect = item.getBoundingClientRect();

                // Calculate the new position of the `.view` element based on mouse coordinates
                let newX = event.clientX - pressRect.left - (viewElement.offsetWidth / 2);
                let newY = event.clientY - pressRect.top - (viewElement.offsetHeight / 2);

                // Keep the `.view` element within the bounds of the parent container
                newX = Math.max(0, Math.min(newX, pressRect.width - viewElement.offsetWidth));
                newY = Math.max(0, Math.min(newY, pressRect.height - viewElement.offsetHeight));

                // Apply the calculated position to the `.view` element using GSAP for smooth animation
                gsap.to(viewElement, {
                    x: newX,
                    y: newY,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        })

    }

}