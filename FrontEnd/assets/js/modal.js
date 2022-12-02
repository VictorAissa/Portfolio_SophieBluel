const body = document.querySelector("body");
const header = document.querySelector("header");
const introduction = document.querySelector("#introduction");
const introductionFigure = document.querySelector("#introduction > figure");
const introductionArticle = document.querySelector("#introduction > article");
const introductionArticleTitle = document.querySelector("#introduction h2");
const portfolioTitle = document.querySelector("#portfolio h2");

//Creation de la bannière et des boutons édition
let editingBanner;
let editingButton;

const createBannner = () => {
    editingBanner = document.createElement("div");
    editingBanner.classList.add("editing_banner");
    editingBanner.innerHTML = `<i class="fa-regular fa-pen-to-square modal_trigger"></i>
    <p>Mode édition</p>
    <button class="changes_publication_button">publier les changements</button>`;
};

const createEditingButton = (id) => {
    editingButton = document.createElement("div");
    editingButton.classList.add("edit_button");
    editingButton.setAttribute("id", id);
    editingButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
    <p>modifier</p>`;
};

if (localStorage.token) {
    createBannner();
    body.insertBefore(editingBanner, header);

    createEditingButton("introduction_figure_button");
    introductionFigure.append(editingButton);

    createEditingButton("introduction_article_button");
    introductionArticle.insertBefore(editingButton, introductionArticleTitle);

    createEditingButton("projects_editing_button");
    portfolio.append(editingButton);
}

const modalContainer = document.querySelector(".modal_container");
const modalTriggers = document.querySelectorAll(".modal_trigger");
const modalContent = document.querySelector(".modal_content");
const projects_editing_button = document.querySelector(
    "#projects_editing_button"
);

//Gestion de la modale au clic

const modalCardCreation = (project) => {
    //Création de la card
    const editingCard = document.createElement("figure");
    editingCard.classList.add("editing_card");
    editingCard.dataset.id = project.id;
    //Insertion de l'image et de la description
    const image = document.createElement("img");
    image.crossOrigin = "anonymous";
    image.src = project.imageUrl;
    image.alt = project.title;
    const description = document.createElement("figcaption");
    description.innerHTML = `<p class="editing_trigger">éditer</p>
        <i class="fa-solid fa-trash-can project_supression_trigger"></i>`;
    // Insertion des cards et de leur contenu dans le document
    modalContent.append(editingCard);
    editingCard.append(image);
    editingCard.append(description);
};

const projectSupression = () => {
    const modalCardsArray = Array.from(modalContent.querySelectorAll("figure"));
    modalCardsArray.forEach((card) => {
        const trashIcon = card.querySelector(".project_supression_trigger");
        trashIcon.addEventListener("click", (event) => {
            event.preventDefault;
            fetch(serverUrl + "works" + "/" + card.dataset.id, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + "" + localStorage.token,
                    "Content-Type": "application/json;charset=utf-8",
                },
            })
                .then((response) => {
                    response.json();
                })
                .then(() => {
                    gallery.innerHTML = "";
                    modalContainer.innerHTML = "";
                    fetch(serverUrl + "works")
                        .then((value) => {
                            if (value.ok) {
                                return value.json();
                            }
                        })
                        .then((projects) => {
                            getAllProjects(projects, modalCardCreation);
                            getAllProjects(projects, cardCreation);
                        });
                });
        });
    });
};

//Affichage de la modale au clic
modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
        modalContainer.classList.toggle("active");
        if (modalContainer.classList.contains("active") === true) {
            modalContent.innerHTML = "";
            fetch(serverUrl + "works")
                .then((value) => {
                    if (value.ok) {
                        return value.json();
                    }
                })
                .then((projects) => getAllProjects(projects, modalCardCreation))
                .then(() => projectSupression())
                .catch((err) => {
                    console.log(err);
                });
        }
    });
});
