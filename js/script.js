
document.addEventListener("DOMContentLoaded", function () {

    // CATEGORY SEARCH
    const categorySearch = document.getElementById("categorySearch");

    if (categorySearch) {
        const cards = document.querySelectorAll(".business-card");

        categorySearch.addEventListener("input", function () {
            const term = this.value.toLowerCase().trim();
            let count = 0;

            cards.forEach(function (card) {
                const text = (card.dataset.search + " " + card.textContent).toLowerCase();
                const match = text.includes(term);

                card.hidden = !match;
                if (match) count++;
            });

            const message = document.getElementById("noCategoryResults");
            if (message) message.hidden = count > 0;
        });
    }

    // OFFER SEARCH, FILTER AND FAVOURITES
    const offerSearch = document.getElementById("offerSearch");

    if (offerSearch) {
        const filters = document.querySelectorAll(".filter-btn");
        const cards = document.querySelectorAll(".offer");
        const count = document.getElementById("offerCount");
        const empty = document.getElementById("noOffers");
        const favouriteToggle = document.getElementById("showFavourites");

        let selected = "all";
        let onlyFavourites = false;
        let favourites = [];

        try {
            favourites = JSON.parse(localStorage.getItem("sauPoolFavourites") || "[]");
        } catch (error) {
            favourites = [];
        }

        function updateOffers() {
            let shown = 0;

            cards.forEach(function (card) {
                const title = card.querySelector("h2").textContent.trim();
                const button = card.querySelector(".offer-favourite");
                const saved = favourites.includes(title);

                button.textContent = saved ? "♥" : "♡";
                button.classList.toggle("saved", saved);

                const searchMatch = card.textContent.toLowerCase()
                    .includes(offerSearch.value.toLowerCase().trim());

                const categoryMatch =
                    selected === "all" || card.dataset.category === selected;

                const favouriteMatch = !onlyFavourites || saved;

                const visible = searchMatch && categoryMatch && favouriteMatch;

                card.hidden = !visible;
                if (visible) shown++;
            });

            count.textContent = "Showing " + shown + " offers";
            empty.hidden = shown !== 0;
        }

        offerSearch.addEventListener("input", updateOffers);

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                selected = button.dataset.filter;

                filters.forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });

                updateOffers();
            });
        });

        cards.forEach(function (card) {
            card.querySelector(".offer-favourite").addEventListener("click", function () {
                const title = card.querySelector("h2").textContent.trim();

                if (favourites.includes(title)) {
                    favourites = favourites.filter(item => item !== title);
                } else {
                    favourites.push(title);
                }

                localStorage.setItem("sauPoolFavourites", JSON.stringify(favourites));
                updateOffers();
            });
        });

        favouriteToggle.addEventListener("click", function () {
            onlyFavourites = !onlyFavourites;

            favouriteToggle.textContent = onlyFavourites
                ? "♥ Show All Offers"
                : "♥ Show My Favourites";

            updateOffers();
        });

        updateOffers();
    }

    // CONTACT FORM
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const message = {
                name: document.getElementById("contactName").value.trim(),
                email: document.getElementById("contactEmail").value.trim(),
                subject: document.getElementById("contactSubject").value.trim(),
                message: document.getElementById("contactMessage").value.trim(),
                date: new Date().toISOString()
            };

            const messages = JSON.parse(localStorage.getItem("sauPoolMessages") || "[]");
            messages.push(message);

            localStorage.setItem("sauPoolMessages", JSON.stringify(messages));

            contactForm.reset();

            document.getElementById("contactFeedback").textContent =
                "Thank you, " + message.name + "! Your message has been saved.";
        });
    }

    // REGISTRATION
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("regEmail").value.trim().toLowerCase();
            const password = document.getElementById("regPassword").value;
            const confirm = document.getElementById("confirmPassword").value;
            const feedback = document.getElementById("registerFeedback");

            if (password !== confirm) {
                feedback.textContent = "Passwords do not match.";
                return;
            }

            let users = JSON.parse(localStorage.getItem("sauPoolUsers") || "{}");

            if (users[email]) {
                feedback.textContent = "This email is already registered. Please log in.";
                return;
            }

            users[email] = {
                name: name,
                password: password
            };

            localStorage.setItem("sauPoolUsers", JSON.stringify(users));

            feedback.textContent = "Registration successful! You can now log in.";
            registerForm.reset();
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;
            const users = JSON.parse(localStorage.getItem("sauPoolUsers") || "{}");
            const feedback = document.getElementById("loginFeedback");

            if (!users[email] || users[email].password !== password) {
                feedback.textContent = "Email or password is incorrect. Please register first.";
                return;
            }

            sessionStorage.setItem("sauPoolLoggedIn", email);

            feedback.textContent = "Login successful! Welcome, " + users[email].name + ".";
        });
    }

});
