const serverUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
const projectsArray = [];

// Création du bandeau Filtres
const filters = document.createElement("div");
filters.classList.add("filters");
portfolio.insertBefore(filters, gallery);

// Fonction de création des filtres
const filterCreation = (element, classes = [], content) => {
    let filter = document.createElement(element);
    classes.forEach((classe) => {
        filter.classList.add(classe);
    });
    filter.textContent = content;
    filters.append(filter);
};

// Fonction de création et affichage des cards
const cardCreation = (project) => {
    const card = document.createElement("figure");
    card.classList.add("card");
    card.dataset.category = project.categoryId;
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

// Fonction récupération des projets
const getAllProjects = (projects, fonction) => {
    const projectsSet = new Set(projects);
    projectsSet.forEach((project) => {
        fonction(project);
    });
};
// Création du premier bouton des filtres
const button = filterCreation("button", ["filter", "active_filter"], "Tous");

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
            filterCreation("button", ["filter"], category.name);
        });
    })
    .catch((err) => {
        console.log(err);
    });

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
            projectsArray.push(project);
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
                    if (index === 0 || index == card.dataset.category) {
                        card.style.display = "block";
                    }
                }
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });
