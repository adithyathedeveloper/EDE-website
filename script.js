function main() {
    const ham = document.querySelector(".ham");
    const newNav = document.querySelector(".newnav");

    ham.addEventListener("click", () => {
        newNav.classList.toggle("active");
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    async function loadWorks() {
        const response = await fetch('./works/info.json');
        const works = await response.json();
        const grid = document.querySelector('.works-grid');

        function buildCards(list) {
            list.forEach(work => {
                const card = document.createElement('div');
                card.classList.add('cardofworks');
                card.innerHTML = `
                <video muted loop playsinline autoplay>
                    <source src="${work.file}" type="video/mp4">
                </video>
                <img src="./elements/silent.png" alt="speaker mute thumbnail" class="mute-icon" id="mute-icon">
                <h3>${work.title}</h3>
            `;
                grid.appendChild(card);

                const muteIcon = card.querySelector('.mute-icon');
                const video = card.querySelector('video');

                muteIcon.addEventListener('click', () => {
                    if (video.muted) {
                        video.muted = false;
                        muteIcon.src = "./elements/volume.png";
                    } else {
                        video.muted = true;
                        muteIcon.src = "./elements/silent.png";
                    }
                
                });

            });
        }

        buildCards(works);  // original
        buildCards(works);  // duplicate — makes the loop seamless
    }


    loadWorks();

}
main();