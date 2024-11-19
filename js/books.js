import lottie from "lottie-web";
import gsap from "gsap";

export class Books{
    constructor(container) {
        this.container = container;
        this.init();
    }

    init(){
        console.log('Books');
        //this.initLottie();
    }

    initLottie(){
        gsap.from('.lottie-container', {opacity:0, duration:2, delay:1});
        lottie.loadAnimation({
            container: this.container.querySelector('.lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://cdn.prod.website-files.com/671617c81d6c82329ba64547/671a968897d7459233c70814_Animation%20-%201729794801222.json'
        });
    }

}