const basePath = "public/media/";
const scrollOptions = { passive: false };
import { initControls, controlsInstance } from "/Experience/World/Controls.js";

const projects = [
    {
        title: "Campus Wayfinding Kiosk",
        shortdesc: "Interactive kiosk for real-time navigation and notifications.",
        media: [
            { type: "image", src: "project1-1.jpg" },
            { type: "image", src: "project1-2.jpg" },
            { type: "image", src: "project1-3.jpg" },
            { type: "image", src: "project1-4.jpg" },
            { type: "image", src: "project1-5.jpg" },
            { type: "image", src: "project1-6.jpg" },
            { type: "image", src: "project1-7.jpg" },
            { type: "image", src: "project1-8.jpg" },
        ]
    },
    {
        title: "ESP- 32 Spotify Modern Record Player",
        shortdesc: "WiFi-enabled record player with Spotify integration and touch controls.",
        media: [
            { type: "image", src: "project2-1.jpg" },
            { type: "image", src: "project2-2.jpg" },
            { type: "image", src: "project2-3.jpg" },
            { type: "image", src: "project2-4.jpg" },
            { type: "image", src: "project2-5.jpg" },
        ]
    },
    {
        title: "Interactive Periodic Table System",
        shortdesc: "Interactive periodic table with database for element details.",
        media: [
            { type: "image", src: "project3-1.jpg" },
            { type: "image", src: "project3-2.jpg" },
            { type: "image", src: "project3-3.jpg" },
            { type: "image", src: "project3-4.jpg" },
            { type: "image", src: "project3-5.jpg" },
            { type: "image", src: "project3-6.jpg" },
        ]
    },
    {
        title: "Campus Network Thesis",
        shortdesc: "Comprehensive study and design of a campus-wide network infrastructure.",
        media: [
            { type: "image", src: "project4-1.jpg" },
            { type: "image", src: "project4-2.jpg" },
            { type: "image", src: "project4-3.jpg" },
            { type: "image", src: "project4-4.jpg" },
            { type: "image", src: "project4-5.jpg" },
        ]
    },
    {
        title: "Doom Walker - FPS Game",
        shortdesc: "A Zombie first-person shooter game built with Unreal Engine 5.",
        thumbnail: "project5-1.jpg",
        media: [
            { type: "video", src: "project5-1.mp4" },
            { type: "image", src: "project5-1.jpg" },
            { type: "image", src: "project5-2.jpg" },
            { type: "image", src: "project5-3.jpg" },
            { type: "image", src: "project5-4.jpg" },
            { type: "image", src: "project5-5.jpg" },
            { type: "image", src: "project5-6.jpg" },
            { type: "image", src: "project5-7.jpg" },
            { type: "image", src: "project5-8.jpg" },
        ]
    },
    {
        title: "In Search of a Grave",
        shortdesc: "A side scrolling hack and slash game developed Game Maker Studio 2.",
        thumbnail: "project6-1.jpg",
        media: [
            { type: "video", src: "project6-1.mp4" },
            { type: "image", src: "project6-1.jpg" },
            { type: "image", src: "project6-2.jpg" },
            { type: "image", src: "project6-3.jpg" },
            { type: "image", src: "project6-4.jpg" },
            { type: "image", src: "project6-5.jpg" },
            { type: "image", src: "project6-6.jpg" },
        ]
    },
    {
        title: "Blender Animations",
        shortdesc: "A collection of satisfying 3D animations created using Blender.",
        thumbnail: "project7-1.jpg",
        media: [
            { type: "video", src: "project7-1.mp4" },
            { type: "video", src: "project7-2.mp4" },
            { type: "video", src: "project7-3.mp4" },
            { type: "video", src: "project7-4.mp4" },
            { type: "video", src: "project7-5.mp4" },
            { type: "video", src: "project7-6.mp4" },
            { type: "video", src: "project7-7.mp4" },
            { type: "video", src: "project7-8.mp4" },
            { type: "video", src: "project7-9.mp4" },
        ]
    },
    {
        title: "n8n Automatic Document Summarizer",
        shortdesc: "An automated workflow to summarize documents using AI.",
        thumbnail: "project8-1.jpg",
        media: [
            { type: "video", src: "project8-1.mp4" },
            { type: "image", src: "project8-2.jpg" },
            { type: "image", src: "project8-3.jpg" },
            { type: "image", src: "project8-4.jpg" },
            { type: "image", src: "project8-5.jpg" },
            { type: "image", src: "project8-6.jpg" },
            { type: "image", src: "project8-1.jpg" },
        ]
    }
];

const workGrids = {
    academic: document.querySelector("#academic-projects .work-grid"),
    personal: document.querySelector("#personal-projects .personal-grid"),
};

projects.forEach((project, index) => {
    // Determine which grid: first 4 = academic, rest = personal
    const isPersonal = index >= 4;
    const grid = isPersonal ? workGrids.personal : workGrids.academic;

    // Pick preview
    const hasThumbnail = !!project.thumbnail;
    const firstMedia = project.media[0];

    let mediaElement = "";

    if (hasThumbnail && firstMedia.type === "video") {
        // Show thumbnail image first + hidden video
        mediaElement = `
      <img src="${basePath + project.thumbnail}" alt="${project.title} Thumbnail" class="work-preview thumb">
      <video muted loop playsinline class="work-preview video hidden">
        <source src="${basePath + firstMedia.src}" type="video/mp4">
      </video>
    `;
    } else {
        // fallback to old behavior
        mediaElement = firstMedia.type === "video"
            ? `<video muted loop playsinline class="work-preview video">
             <source src="${basePath + firstMedia.src}" type="video/mp4">
           </video>`
            : `<img src="${basePath + firstMedia.src}" alt="${project.title} Preview" class="work-preview thumb">`;
    }

    // Create work-item container
    const workItem = document.createElement("div");
    workItem.classList.add("work-item");
    if (isPersonal) workItem.classList.add("personal");
    if (hasThumbnail) workItem.classList.add("has-thumb");
    workItem.dataset.project = index;

    // Set innerHTML depending on project type
    if (isPersonal) {
        workItem.innerHTML = `
      ${mediaElement}
      <div class="work-overlay">
        <h3 class="project-title">${project.title}</h3>
      </div>
    `;
    } else {
        workItem.innerHTML = `
      ${mediaElement}
      <div class="gradient-overlay"></div>
      <div class="view-project">View Project</div>
      <div class="work-overlay">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-short-desc">${project.shortdesc || ""}</p>
      </div>
    `;
    }

    // Handle hover play/pause for previews
    document.querySelectorAll(".work-item.personal video").forEach(video => {
        video.pause(); // ensure not playing
        video.closest(".work-item").addEventListener("mouseenter", () => video.play());
        video.closest(".work-item").addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0; // reset to start
        });
    });

    // Append to grid
    grid.appendChild(workItem);
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const projectTitle = document.getElementById("project-title");
const projectDesc = document.getElementById("project-desc");

let currentProject = 0;
let currentImage = 0;

document.querySelectorAll(".work-item").forEach(item => {
    item.addEventListener("click", () => {
        currentProject = parseInt(item.dataset.project);
        currentImage = 0;
        openLightbox();
    });
});

function openLightbox() {
    const proj = projects[currentProject];
    projectTitle.textContent = proj.title;

    // Grab description from hidden HTML
    const descElement = document.querySelector(`#desc-${currentProject}`);
    projectDesc.innerHTML = descElement ? descElement.innerHTML : "";

    renderMedia();
    lightbox.classList.add("active");

    disableScroll();
}

function closeLightbox() {
    lightbox.classList.remove("active");

    const videos = lightbox.querySelectorAll("video");
    videos.forEach(v => {
        v.pause();
        v.currentTime = 0;
        v.src = ""; // unload source to kill audio completely
    });

    lightbox.classList.remove("active");

    enableScroll();
}

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);

document.querySelector(".lightbox-prev").addEventListener("click", () => {
    const proj = projects[currentProject];
    currentImage = (currentImage - 1 + proj.media.length) % proj.media.length;
    renderMedia();
});

document.querySelector(".lightbox-next").addEventListener("click", () => {
    const proj = projects[currentProject];
    currentImage = (currentImage + 1) % proj.media.length;
    renderMedia();
});


//Enable/disable scroll
function disableScroll() {
    if (window.lenis) window.lenis.stop(); // stop Lenis updates
    // document.body.style.overflow = "hidden"; // block native scroll
    // document.addEventListener("wheel", preventScroll, { passive: false });
    // document.addEventListener("touchmove", preventScroll, { passive: false });
}

function enableScroll() {
    if (window.lenis) {
        window.lenis.start();
        // Force Lenis to sync with actual position
        requestAnimationFrame(() => window.lenis.raf(performance.now()));
    }
    // document.body.style.overflow = "";
    // document.removeEventListener("wheel", preventScroll, { passive: false });
    // document.removeEventListener("touchmove", preventScroll, { passive: false });
}

function preventScroll(e) {
    e.preventDefault();
}

function renderMedia() {
    const container = document.querySelector(".lightbox-image");
    container.innerHTML = ""; // clear previous

    const item = projects[currentProject].media[currentImage];
    if (!item) return;

    if (item.type === "image") {
        const img = document.createElement("img");
        img.src = basePath + item.src;
        img.classList.add("lightbox-img");
        container.appendChild(img);
    } else if (item.type === "video") {
        const video = document.createElement("video");
        video.src = basePath + item.src;
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.classList.add("lightbox-video");
        container.appendChild(video);
    }

    // Re-append the nav buttons after media
    const prevBtn = document.createElement("button");
    prevBtn.className = "lightbox-prev";
    prevBtn.textContent = "❮";
    prevBtn.addEventListener("click", () => {
        const proj = projects[currentProject];
        currentImage = (currentImage - 1 + proj.media.length) % proj.media.length;
        renderMedia();
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "lightbox-next";
    nextBtn.textContent = "❯";
    nextBtn.addEventListener("click", () => {
        const proj = projects[currentProject];
        currentImage = (currentImage + 1) % proj.media.length;
        renderMedia();
    });

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
}
