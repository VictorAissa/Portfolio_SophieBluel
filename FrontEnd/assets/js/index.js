const serverUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");

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

//Modification après login
const body = document.querySelector("body");
const header = document.querySelector("header");
const introduction = document.querySelector("#introduction");
const introductionFigure = document.querySelector("#introduction > figure");
const introductionArticle = document.querySelector("#introduction > article");
const introductionArticleTitle = document.querySelector("#introduction h2");
const portfolioTitle = document.querySelector("#portfolio h2");

const editionButtonArray = [];

let editionBanner;
let editionButton;

const createBannner = () => {
    editionBanner = document.createElement("div");
    editionBanner.classList.add("edition_banner");
    editionBanner.innerHTML = `<i class="fa-regular fa-pen-to-square modal_trigger"></i>
    <p>Mode édition</p>
    <button class="changes_publication">publier les changements</button>`;
};

const createButton = () => {
    for (let index = 0; index < 3; index++) {
        editionButton = document.createElement("div");
        editionButton.classList.add("edit_button");
        editionButton.classList.add(`edit_button_${index}`);
        editionButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
    <p>modifier</p>`;
        editionButtonArray.push(editionButton);
    }
};

if (localStorage.token) {
    createBannner();
    body.insertBefore(editionBanner, header);
    createButton();
    console.log(editionButtonArray);
    introductionFigure.append(editionButtonArray[0]);
    introductionArticle.insertBefore(
        editionButtonArray[1],
        introductionArticleTitle
    );
    editionButtonArray[2].classList.add("modal_trigger");
    portfolio.append(editionButtonArray[2]);
}
