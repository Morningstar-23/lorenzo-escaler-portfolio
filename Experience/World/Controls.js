import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from '@ashthornton/asscroll';
import Lenis from '@studio-freight/lenis'

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    setupLenis() {
        // check if device is touch (mobile / tablet)
        // if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        //     console.log("Mobile detected → using native scroll only")
        //     return null // don't init Lenis at all
        // }
        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 2), // ease-out cubic
            smoothWheel: true,
            smoothTouch: true,
        })

        // --- custom scrollbar sync ---
        const scrollbar = document.querySelector('.scrollbar')
        const scrollbarThumb = document.querySelector('.scrollbar-thumb')

        // RAF loop
        function raf(time) {
            if (lenis) {        // only run if lenis exists
                lenis.raf(time)
            }

            // update scrollbar thumb every frame
            const progress = lenis.progress
            const trackHeight = scrollbar.offsetHeight
            const thumbHeight = scrollbarThumb.offsetHeight
            const y = progress * (trackHeight - thumbHeight)
            scrollbarThumb.style.transform = `translateY(${y}px)`

            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        GSAP.ticker.add((time) => lenis.raf(time * 1000))

        // --- make scrollbar draggable ---
        let isDragging = false
        let startY, startScroll

        scrollbarThumb.addEventListener("mousedown", (e) => {
            isDragging = true
            startY = e.clientY
            startScroll = lenis.scroll
            document.body.style.userSelect = "none" // prevent text selection
        })

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return

            const delta = e.clientY - startY
            const trackHeight = scrollbar.offsetHeight
            const thumbHeight = scrollbarThumb.offsetHeight
            const scrollRange = trackHeight - thumbHeight

            const scrollDelta = (delta / scrollRange) * lenis.limit
            lenis.scrollTo(startScroll + scrollDelta, { immediate: true })
        })

        window.addEventListener("mouseup", () => {
            isDragging = false
            document.body.style.userSelect = ""
        })

        return lenis
    }

    setSmoothScroll() {
        this.lenis = this.setupLenis();
        window.lenis = this.lenis;
    }

    getLenis() {
        return this.lenis;
    }

    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            // Desktop
            "(min-width: 969px)": () => {
                //console.log("fired desktop");

                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.5;
                this.rectLight.height = 0.7;


                // First Section ---------------------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.to(this.room.position, {
                    x: () => {
                        return this.sizes.width * 0.0014;
                    },
                });

                // Second Section ---------------------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => {
                                return 1
                            },
                            z: () => {
                                return this.sizes.height * 0.0032;
                            }
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.4,
                            y: 0.4,
                            z: 0.4,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.5 * 4,
                            height: 0.7 * 4,
                        },
                        "same"
                    );
                // Third Section ---------------------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(this.camera.orthographicCamera.position, {
                        y: 1.5,
                        x: -4.1,
                    });
            },

            // Mobile
            "(max-width: 968px)": () => {
                //console.log("fired mobile");

                // Resets
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0);
                this.rectLight.width = 0.3;
                this.rectLight.height = 0.4;


                // First Section ---------------------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.1,
                    y: 0.1,
                    x: 0.1,
                });

                // Second Section ---------------------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.scale,
                        {
                            x: 0.25,
                            y: 0.25,
                            z: 0.25,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.3 * 3.4,
                            height: 0.3 * 3.4,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            x: 1.5,
                        },
                        "same"
                    );

                // Third Section ---------------------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,
                });
            },

            //all
            all: () => {
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector(".progress-wrapper");
                    this.progressBar =
                        section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6
                            },
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    });
                });

                // All Animations ----------------------
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section -----------------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                    .to(
                        this.circleSecond.scale,
                        {
                            x: 3,
                            y: 3,
                            z: 3,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            y: 0.7,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",

                        /* Activate if you want Scrubbing */
                        // end: "bottom bottom",
                        // scrub: 0.6,
                        // invalidateOnRefresh: true,
                    },
                });

                this.room.children.forEach(child => {
                    if (child.name === "Mini_Floor") {
                        this.first = GSAP.to(child.position, {
                            x: -5.44055,
                            z: 13.6135,
                            duration: 0.3
                        });
                    }

                    if (child.name === "Mailbox") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Lamp") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorFirst") {
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorSecond") {
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorThird") {
                        this.sixth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Dirt") {
                        this.seventh = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Flower1") {
                        this.eighth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Flower2") {
                        this.ninth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                });

                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second,);
                this.secondPartTimeline.add(this.third,);
                this.secondPartTimeline.add(this.fourth, "-=0.2");
                this.secondPartTimeline.add(this.fifth, "-=0.2");
                this.secondPartTimeline.add(this.sixth, "-=0.2");
                this.secondPartTimeline.add(this.seventh, "-=0.2");
                this.secondPartTimeline.add(this.eighth);
                this.secondPartTimeline.add(this.ninth, "-=0.1");
            },
        });
    }
    resize() { }

    update() {
    }
}

export let controlsInstance;

export function initControls() {
    controlsInstance = new Controls();
    return controlsInstance;
}