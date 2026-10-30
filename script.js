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

if (savedTheme !== "light") {
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

    // The carousel exists only on the main Works page
    if (!document.querySelector(".works-grid")) return;

    try {

        // Keep your existing carousel code here.

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
// ========================================
// LOAD CAMPAIGN PAGES
// ========================================

async function loadCampaigns() {

    const campaignPage = document.querySelector(".campaign-page");

    // Only run on campaign pages
    if (!campaignPage) return;

    const list = document.getElementById("campaign-list");
    const jsonPath = campaignPage.dataset.worksFile;

    if (!list || !jsonPath) return;

    try {

        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Failed to load campaign data: ${response.status}`);
        }

        const campaigns = await response.json();

        list.replaceChildren();

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            list.innerHTML = `
                <p class="campaign-message">
                    No campaigns have been added to this collection yet.
                </p>
            `;
            return;
        }

        campaigns.forEach(campaign => {

            const card = document.createElement("article");
            card.classList.add("campaign-card");

            // Video container
            const media = document.createElement("div");
            media.classList.add("campaign-media");

            const video = document.createElement("video");
            video.classList.add("campaign-video");

            video.controls = true;
            video.controlsList = "nodownload";
            video.preload = "metadata";
            video.playsInline = true;
            video.muted = true;

            if (campaign.thumbnail) {
                video.poster = campaign.thumbnail;
            }

            const source = document.createElement("source");
            source.src = campaign.video;
            source.type = "video/mp4";

            video.appendChild(source);
            media.appendChild(video);

            // Campaign information
            const content = document.createElement("div");
            content.classList.add("campaign-content");

            const brand = document.createElement("p");
            brand.classList.add("campaign-brand");
            brand.textContent = campaign.brand || "EDE Campaign";

            const title = document.createElement("h2");
            title.classList.add("campaign-title");
            title.textContent = campaign.title || "Untitled Campaign";

            content.append(brand, title);

            // Optional campaign description
            if (campaign.description) {

                const description = document.createElement("p");
                description.classList.add("campaign-description");
                description.textContent = campaign.description;

                content.appendChild(description);
            }

            // Helper to create an idea or approach section
            function addDetail(heading, text) {

                if (!text) return;

                const detail = document.createElement("div");
                detail.classList.add("campaign-detail");

                const detailHeading = document.createElement("h3");
                detailHeading.textContent = heading;

                const detailText = document.createElement("p");
                detailText.textContent = text;

                detail.append(detailHeading, detailText);
                content.appendChild(detail);
            }

            addDetail(
                campaign.ideaTitle || "The Creative Idea",
                campaign.idea
            );

            addDetail(
                campaign.approachTitle || "Creative Approach",
                campaign.approach
            );

            card.append(media, content);
            list.appendChild(card);

        });

    } catch (error) {

        console.error("Unable to load campaigns:", error);

        list.innerHTML = `
            <p class="campaign-message">
                We couldn't load these campaigns. Please try again later.
            </p>
        `;

    }
}

   loadCampaigns();
loadWorks();
}

main();