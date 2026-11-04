// SAU POLL Task-6: Search, category filters and favourites

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("offerSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const offerCards = document.querySelectorAll(".offer");
    const favouritesButton = document.getElementById("showFavourites");
    const offerCount = document.getElementById("offerCount");
    const noOffers = document.getElementById("noOffers");

    // Read saved favourites from this browser.
    let favourites = [];
    try {
        favourites = JSON.parse(localStorage.getItem("sauPollFavourites")) || [];
    } catch (error) {
        favourites = [];
    }

    let selectedCategory = "all";
    let favouritesOnly = false;

    function saveFavourites() {
        localStorage.setItem("sauPollFavourites", JSON.stringify(favourites));
    }

    function updateFavouriteButtons() {
        offerCards.forEach(function (card) {
            const title = card.querySelector("h3").textContent.trim();
            const button = card.querySelector(".offer-favourite");
            const isSaved = favourites.includes(title);

            button.textContent = isSaved ? "♥" : "♡";
            button.classList.toggle("saved", isSaved);
            button.setAttribute("aria-pressed", String(isSaved));
            button.setAttribute(
                "aria-label",
                (isSaved ? "Remove " : "Add ") + title + " " +
                (isSaved ? "from" : "to") + " favourites"
            );
        });
    }

    function filterOffers() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        offerCards.forEach(function (card) {
            const category = card.dataset.category;
            const cardText = card.textContent.toLowerCase();
            const title = card.querySelector("h3").textContent.trim();
            const matchesSearch = cardText.includes(searchTerm);
            const matchesCategory =
                selectedCategory === "all" || category === selectedCategory;
            const matchesFavourite =
                !favouritesOnly || favourites.includes(title);

            const isVisible =
                matchesSearch && matchesCategory && matchesFavourite;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        noOffers.classList.toggle("show", visibleCount === 0);
        offerCount.textContent =
            "Showing " + visibleCount + (visibleCount === 1 ? " offer" : " offers");
    }

    // Feature 1: search offers by text.
    searchInput.addEventListener("input", filterOffers);

    // Feature 2: filter offers by category.
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.filter;

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            filterOffers();
        });
    });

    // Feature 3: save or remove an offer from favourites.
    offerCards.forEach(function (card) {
        const title = card.querySelector("h3").textContent.trim();
        const button = card.querySelector(".offer-favourite");

        button.addEventListener("click", function () {
            if (favourites.includes(title)) {
                favourites = favourites.filter(function (item) {
                    return item !== title;
                });
            } else {
                favourites.push(title);
            }

            saveFavourites();
            updateFavouriteButtons();
            filterOffers();
        });
    });

    // Show only saved offers when this button is selected.
    favouritesButton.addEventListener("click", function () {
        favouritesOnly = !favouritesOnly;
        favouritesButton.setAttribute("aria-pressed", String(favouritesOnly));
        favouritesButton.textContent = favouritesOnly
            ? "♥ Show All Offers"
            : "♥ Show My Favourites";
        filterOffers();
    });

    updateFavouriteButtons();
    filterOffers();
});
