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
// Dark Mode
// ------------------------
const themeToggles = document.querySelectorAll(".theme-toggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}

// Add click event to BOTH theme toggles
themeToggles.forEach(toggle => {

    toggle.addEventListener("click", (event) => {

        // Prevent hamburger menu from opening
        event.stopPropagation();

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }

    });

});

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
                playsinline
                preload="metadata"
                poster="${work.thumbnail || ''}">

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
        // CLICK VIDEO → PLAY / PAUSE
        // ------------------------

        video.addEventListener("click", () => {

            if (video.paused) {

                video.play().catch(() => {});

            } else {

                video.pause();

            }

        });


        // ------------------------
        // MUTE / UNMUTE
        // ------------------------

        muteIcon.addEventListener("click", (event) => {

            // Don't let the click affect the video
            event.stopPropagation();

            const allVideos = document.querySelectorAll(".work-video");
            const allIcons = document.querySelectorAll(".mute-icon");


            // ------------------------
            // CURRENTLY MUTED
            // → UNMUTE
            // ------------------------

            if (video.muted) {

                // Mute every other video
                allVideos.forEach(otherVideo => {

                    if (otherVideo !== video) {

                        otherVideo.muted = true;

                    }

                });


                // Change every other icon to silent
                allIcons.forEach(otherIcon => {

                    if (otherIcon !== muteIcon) {

                        otherIcon.src = "./elements/silent.png";

                    }

                });


                // Unmute this video
                video.muted = false;

                // Change this icon
                muteIcon.src = "./elements/volume.png";


                // Make sure video continues playing
                if (video.paused) {

                    video.play().catch(() => {});

                }

            }


            // ------------------------
            // CURRENTLY UNMUTED
            // → MUTE
            // ------------------------

            else {

                video.muted = true;

                muteIcon.src = "./elements/silent.png";

            }

        });

    });

}



            // Build the portfolio cards ONCE
            buildCards(works);
            const prevButton = document.querySelector(".prev");
            const nextButton = document.querySelector(".next");

            let currentPosition = 0;

            function getCardStep() {

                const card = document.querySelector(".cardofworks");

                if (!card) return 0;

                const gridStyle = window.getComputedStyle(grid);

                const gap = parseFloat(gridStyle.columnGap) || 0;

                return card.offsetWidth + gap;

            }


            function updateButtons() {

                if (currentPosition === 0) {

                    prevButton.style.opacity = "0.4";
                    prevButton.style.pointerEvents = "none";

                } else {

                    prevButton.style.opacity = "1";
                    prevButton.style.pointerEvents = "auto";

                }


                if (currentPosition >= works.length - 1) {

                    nextButton.style.opacity = "0.4";
                    nextButton.style.pointerEvents = "none";

                } else {

                    nextButton.style.opacity = "1";
                    nextButton.style.pointerEvents = "auto";

                }

            }


            nextButton.addEventListener("click", () => {

                if (currentPosition < works.length - 1) {

                    currentPosition++;

                    grid.style.transform =
                        `translateX(-${currentPosition * getCardStep()}px)`;

                }

                updateButtons();

            });


            prevButton.addEventListener("click", () => {

                if (currentPosition > 0) {

                    currentPosition--;

                    grid.style.transform =
                        `translateX(-${currentPosition * getCardStep()}px)`;

                }

                updateButtons();

            });


            window.addEventListener("resize", () => {

                grid.style.transform =
                    `translateX(-${currentPosition * getCardStep()}px)`;

            });


            updateButtons();
        }

        catch (err) {

            console.error("Unable to load works:", err);

        }

    }


    loadWorks();
}

main();