import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Swiper from 'swiper/bundle';

gsap.registerPlugin(ScrollTrigger);

export class Speaking{
    constructor(container) {
        this.container = container;
        this.changeItems = container.querySelectorAll('.change-item');
        this.video = container.querySelector('video');
        this.videoBtn = container.querySelector('.vid-player-btn');
        this.scrollWrapper = this.container.querySelector('.topics-grid');
        this.scrollTrack = this.container.querySelector('.topics-list');
        this.cards = this.container.querySelectorAll('.topics-item');
        this.totalCards = this.cards.length;
        this.threshold = 1 / (this.totalCards - 1);
        this.init();
    }

    init(){
        console.log('Speaking');
        this.introImgReveal();
        this.initScroll();
        this.initTestimonials();
        this.initChange();
        this.initVideo();

    }

    introImgReveal(){
        this.introVisual = this.container.querySelector('.media-hero-img');
        this.introHeader = this.container.querySelector('.media-header').querySelector('.word')
        this.introSpan = this.container.querySelector('.media-header').querySelector('.s-span')
        gsap.from(this.introHeader, {xPercent: -150, duration: 3, ease: "expo.out", delay:0.4})
        gsap.from(this.introSpan, {xPercent: 150, duration: 3, ease: "expo.out", delay:0.4})
        gsap.from(this.introVisual, {clipPath: 'inset(0% 0% 100% 0%)', ease: "expo.inOut", duration: 4});
        gsap.from(this.introVisual.querySelector('img'), { scale: 1.3, ease: "expo.out", duration: 4, delay: 0.4});
    }

    initTestimonials(){
        const swiper = new Swiper(".swiper", {
            speed: 1000,
            loop: true,
            navigation: {
                nextEl: ".next-btn",
                prevEl: ".prev-btn",
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
        });

        const swiperC = new Swiper(".swiper-c", {
            spaceBetween: 0,
            centeredSlides: true,
            speed: 3000,
            autoplay: {
                delay: 0,
            },
            loop: true,
            slidesPerView: 'auto',
            allowTouchMove: false,
            disableOnInteraction: true,
        })
    }

    initChange(){
        const tl = gsap.timeline({repeat: -1, repeatDelay: 0});
        const stagger = 3;
        tl.from(this.changeItems, {yPercent: 100, opacity: 0, duration: 0.65, stagger: stagger})
            .to(this.changeItems, {yPercent: -100, opacity: 0, duration: 0.65, stagger: stagger}, stagger);
    }

    initVideo(){
        this.videoBtn.addEventListener('click', ()=>{
            this.video.play().then(()=>{
                gsap.to(this.videoBtn, {opacity: 0, display: 'none', duration: 0.5})
                this.video.setAttribute('controls', 'controls');
            })

        });
    }

    initScroll(){

        let lastActiveIndex = 0;

        // Calculate positions for each threshold
        const positions = Array.from({ length: this.totalCards }, (_, i) => {
            return i * -17; // 20rem shifts for each position
        });

        ScrollTrigger.create({
            trigger: this.scrollWrapper,
            start: "top top",
            end: `+=${(this.totalCards-1)*50}%`,
            invalidateOnRefresh: true,
            pin: true,
            markers: false,
            onUpdate: (self) => {
                const progress = self.progress;
                const currentSection = Math.floor(progress / this.threshold);

                // Only update if we've crossed a threshold
                if (currentSection !== lastActiveIndex && currentSection < this.totalCards) {
                    // Remove active class from all cards
                    this.cards.forEach(card => card.classList.remove('active'));

                    // Add active class to current card
                    this.cards[currentSection].classList.add('active');
                    gsap.fromTo(this.cards[currentSection].querySelector('.topics-p').querySelectorAll('.char'), {yPercent:120, opacity:0}, {yPercent:0, opacity:1, duration:1.2, ease: 'expo.out', delay:0.4});

                    // Move track to the pre-calculated position
                    //this.scrollTrack.style.transform = `translateX(${positions[currentSection]}vw)`;
                    gsap.to(this.scrollTrack, {x: `${positions[currentSection]}rem`, duration: 0.5, ease: 'power2.out'});

                    lastActiveIndex = currentSection;
                }
            }
        });

        // Set first card as active initially
        this.cards[0].classList.add('active');

        window.addEventListener("load", () => ScrollTrigger.refresh());

    }

}