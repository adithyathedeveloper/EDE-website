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
                            controlsList="nodownload"
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
                    video.addEventListener("dblclick", () => {

                        if (document.fullscreenElement) {

                            document.exitFullscreen();

                        } else {

                            video.requestFullscreen().catch(err => {

                                console.log(err);

                            });

                        }

                    });
                    // ------------------------
                    // Mute / Unmute
                    // ------------------------
                    muteIcon.addEventListener("click", () => {

                        const allVideos = document.querySelectorAll(".work-video");
                        const allIcons = document.querySelectorAll(".mute-icon");

                        if (video.muted) {

                            // Pause and mute every other video
                            allVideos.forEach(v => {

                                if (v !== video) {

                                    v.pause();
                                    v.muted = true;

                                }

                            });

                            allIcons.forEach(icon => {

                                if (icon !== muteIcon) {

                                    icon.src = "./elements/silent.png";

                                }

                            });

                            video.muted = false;
                            muteIcon.src = "./elements/volume.png";

                            video.play().catch(() => { });

                        }

                        else {

                            // Mute this video
                            video.muted = true;
                            muteIcon.src = "./elements/silent.png";

                            // Resume every visible video
                            allVideos.forEach(v => {

                                const rect = v.getBoundingClientRect();

                                const visible =
                                    rect.left < window.innerWidth &&
                                    rect.right > 0;

                                if (visible) {
                                    v.play().catch(() => { });
                                }

                            });

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

                    video.play().catch(() => { });

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

                    video.play().catch(() => { });

                }

            });

        }

    });

    loadWorks();
}

main();