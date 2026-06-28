function main() {

    // ------------------------
    // Navigation
    // ------------------------

    const ham = document.querySelector(".ham");
    const newNav = document.querySelector(".newnav");

    if (ham && newNav) {
        ham.addEventListener("click", () => {
            newNav.classList.toggle("active");
        });
    }

    // ------------------------
    // Footer Year
    // ------------------------

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // ------------------------
    // Load Works
    // ------------------------

    async function loadWorks() {

        try {

            const response = await fetch("./works/info.json");
            const works = await response.json();

            const grid = document.querySelector(".works-grid");

            if (!grid) return;

            function buildCards(list) {

                list.forEach(work => {

                    const card = document.createElement("div");
                    card.classList.add("cardofworks");

                    card.innerHTML = `

                        <video
                            class="work-video"
                            muted
                            loop
                            playsinline
                            preload="metadata">

                            <source
                                src="${work.file}"
                                type="video/mp4">

                        </video>

                        <img
                            src="./elements/silent.png"
                            alt="Mute / Unmute"
                            class="mute-icon">

                        <h3>${work.title}</h3>

                    `;

                    grid.appendChild(card);

                    const video = card.querySelector(".work-video");
                    const muteIcon = card.querySelector(".mute-icon");

                    // ------------------------
                    // Mute / Unmute
                    // ------------------------

                    muteIcon.addEventListener("click", () => {

                        const allVideos = document.querySelectorAll(".work-video");
                        const allIcons = document.querySelectorAll(".mute-icon");

                        // If this video is muted -> unmute only this one
                        if (video.muted) {

                            allVideos.forEach(v => {
                                v.muted = true;
                            });

                            allIcons.forEach(icon => {
                                icon.src = "./elements/silent.png";
                            });

                            video.muted = false;
                            muteIcon.src = "./elements/volume.png";

                        }

                        else {

                            video.muted = true;
                            muteIcon.src = "./elements/silent.png";

                        }

                    });

                });

            }

            // Duplicate cards for infinite marquee
            buildCards(works);
            buildCards(works);

            observeVideos();

        }

        catch (err) {

            console.error("Unable to load works:", err);

        }

    }

    // ------------------------
    // Play only visible videos
    // ------------------------

    function observeVideos() {

        const videos = document.querySelectorAll(".work-video");

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                const video = entry.target;

                if (entry.isIntersecting) {

                    video.play().catch(() => {});

                }

                else {

                    video.pause();

                }

            });

        }, {

            threshold: 0.6

        });

        videos.forEach(video => observer.observe(video));

    }

    // ------------------------
    // Pause when tab inactive
    // ------------------------

    document.addEventListener("visibilitychange", () => {

        const videos = document.querySelectorAll(".work-video");

        if (document.hidden) {

            videos.forEach(video => video.pause());

        }

        else {

            videos.forEach(video => {

                const rect = video.getBoundingClientRect();

                const visible =
                    rect.left < window.innerWidth &&
                    rect.right > 0;

                if (visible) {

                    video.play().catch(() => {});

                }

            });

        }

    });

    loadWorks();

}

main();