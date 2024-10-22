import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export class Home{
    constructor(container) {
        this.container = container;
        this.init();
    }

    init(){
        console.log('Home');
        this.featuredLogosReveal();
    }

    featuredLogosReveal(){
        this.featuredLogosList = document.querySelector('.featured-logos-list');
        this.featuredLogos = document.querySelectorAll('.featured-logo-item');
        gsap.from(this.featuredLogos, {opacity:0, ease: 'expo.out', stagger:{
            amount: 2,
            }, scrollTrigger:{
            trigger: this.featuredLogosList,
            start: 'top 80%',
            }});
    }

}