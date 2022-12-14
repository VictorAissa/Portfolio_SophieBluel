const serverUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");

// Création du bandeau Filtres
const filters = document.createElement("div");
filters.classList.add("filters");
portfolio.insertBefore(filters, gallery);

// Fonction de création des filtres
const createFilter = (element, classes = [], content) => {
    let filter = document.createElement(element);
    classes.forEach((classe) => {
        filter.classList.add(classe);
    });
    filter.textContent = content;
    filters.append(filter);
};

const button = createFilter("button", ["filter", "active_filter"], "Tous");

// Fonction de création et affichage des cards
const createCard = (project) => {
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

// Fonction d'application des filtres
const applyFilters = () => {
    let filtersList = document.querySelectorAll(".filter");
    filtersList.forEach((filter, index) => {
        filter.addEventListener("click", function () {
            // Application de la classe active sur bouton du filtre
            document
                .querySelector(".active_filter")
                .classList.remove("active_filter");
            this.classList.add("active_filter");

            // Masquage des cartes puis affichage selon filtre cliqué
            let cards = document.querySelectorAll(".card");
            for (let card of cards) {
                card.style.display = "none";
                if (index === 0 || index == card.dataset.category) {
                    card.style.display = "block";
                }
            }
        });
    });
};

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
            createFilter("button", ["filter"], category.name);
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
        getAllProjects(projects, createCard);
        applyFilters();
    })
    .catch((err) => {
        console.log(err);
    });
