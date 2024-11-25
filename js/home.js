import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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