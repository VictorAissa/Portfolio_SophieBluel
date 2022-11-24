const serverUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");

// Création du bandeau Filtres
const filters = document.createElement("div");
filters.classList.add("filters");
portfolio.insertBefore(filters, gallery);

// Création du premier bouton des filtres
filters.innerHTML = `<button class="filter active_filter">Tous</button>`;

// Récupération des catégories sur le serveur
fetch(serverUrl + "categories")
    .then((value) => {
        if (value.ok) {
            return value.json();
        }
    })
    // Création des boutons des filtres par catégorie
    .then((categories) => {
        categories.forEach((category) => {
            let button = document.createElement("button");
            button.classList.add("filter");
            button.textContent = category.name;
            filters.append(button);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Fonction création et affichage des cards
const cardCreation = (project) => {
    const card = document.createElement("figure");
    card.classList.add("card");
    card.setAttribute(`data-${project.categoryId}`, "");
    // Création des images
    const image = document.createElement("img");
    image.crossOrigin = "anonymous";
    image.src = project.imageUrl;
    image.alt = project.title;
    // Création des descriptions
    const description = document.createElement("figcaption");
    description.textContent = project.title;
    // Insertion des cards et de leur contenu dans le document
    gallery.append(card);
    card.append(image);
    card.append(description);
};

// Récupération des projets depuis le serveur
fetch(serverUrl + "works")
    .then((value) => {
        if (value.ok) {
            return value.json();
        }
    })
    // Création des cards et affichage par défaut
    .then((projects) => {
        const projectsSet = new Set(projects);
        projectsSet.forEach((project) => {
            cardCreation(project);
        });

        // Application des filtres
        let filtersList = document.querySelectorAll(".filter");
        filtersList.forEach((filter, index) => {
            filter.addEventListener("click", function () {
                // Application de la classe active sur bouton du filtre
                document
                    .querySelector(".active_filter")
                    .classList.remove("active_filter");
                this.classList.add("active_filter");

                // Masquage par défaut de toutes les cartes
                let cards = document.querySelectorAll(".card");
                for (let card of cards) {
                    card.style.display = "none";
                    // Affichage des cartes au clic sur le filtre correspondant
                    if (index === 0) {
                        card.style.display = "block";
                    }
                    if (index in card.dataset) {
                        card.style.display = "block";
                    }
                }
            });
        });
    })

    .catch((err) => {
        console.log(err);
    });
