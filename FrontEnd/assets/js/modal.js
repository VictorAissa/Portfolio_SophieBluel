const body = document.querySelector("body");
const header = document.querySelector("body > header");
const introduction = document.querySelector("#introduction");

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
    const introductionFigure = introduction.querySelector("figure");
    introductionFigure.append(editingButton);

    createEditingButton("introduction_article_button");
    const introductionArticle = introduction.querySelector("article");
    const introductionArticleTitle = introduction.querySelector("h2");
    introductionArticle.insertBefore(editingButton, introductionArticleTitle);

    createEditingButton("projects_editing_button");
    portfolio.append(editingButton);
}

// GESTION DES MODALES

const supressionModal = document.querySelector("#supression_modal");
const addingModal = document.querySelector("#adding_modal");
const overlay = document.querySelector(".overlay");
const supressionModalContent = supressionModal.querySelector(".modal_content");
const uploadedImageContainer = addingModal.querySelector(
    ".image_upload_container"
);
const image = addingModal.querySelector("#image_upload");
const title = addingModal.querySelector("#title_input");
const category = addingModal.querySelector("#category_input");

// Fonctions de gestion d'ouverture/fermeture des modales
const modalOpening = (modal) => {
    overlay.classList.add("active");
    modal.classList.add("active");
};

const modalClosing = (modal) => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
};

// Fonction de création des cartes de la modale supression
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
    supressionModalContent.append(editingCard);
    editingCard.append(image);
    editingCard.append(description);
};

// Fonctions de supression d'un ou de tous les projets
const projectSupression = (projectNumber) => {
    fetch(serverUrl + "works" + "/" + projectNumber, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + "" + localStorage.token,
            "Content-Type": "application/json;charset=utf-8",
        },
    })
        .then((response) => {
            // afficher succes/insucces de la supression
        })
        .then(() => {
            gallery.innerHTML = "";
            fetch(serverUrl + "works")
                .then((value) => {
                    if (value.ok) {
                        return value.json();
                    }
                })
                .then((projects) => {
                    getAllProjects(projects, cardCreation);
                    filtersApplication();
                });
        });
};

const allProjectsSupression = () => {
    const cards = supressionModalContent.querySelectorAll(".editing_card");
    cards.forEach((card) => {
        fetch(serverUrl + "works" + "/" + card.dataset.id, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + "" + localStorage.token,
                "Content-Type": "application/json;charset=utf-8",
            },
        })
            .then((response) => {
                // afficher succes/insucces de la supression
            })
            .then(() => {
                gallery.innerHTML = "";
                fetch(serverUrl + "works")
                    .then((value) => {
                        if (value.ok) {
                            return value.json();
                        }
                    })
                    .then((projects) => {
                        getAllProjects(projects, cardCreation);
                        filtersApplication();
                    });
            });
    });
};

// Fonctions d'affichage de l'image chargée, de gestion du style du bouton submit
//  et de nettoyage du formulaire
const displayImage = (imageInput, imageContainer) => {
    let uploadedImage;
    imageInput.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            uploadedImage = reader.result;
            imageContainer.style.backgroundImage = `url(${uploadedImage})`;
        });
        reader.readAsDataURL(this.files[0]);
    });
};

const toggleButtonStyle = (button) => {
    if (image.value && title.value && category.value) {
        button.classList.remove("inactive_button");
    } else {
        button.classList.add("inactive_button");
    }
};

function formClearing() {
    image.value = "";
    title.value = "";
    category.value = "";
    uploadedImageContainer.style.backgroundImage = "";
}

// Ouverture de la supressionModal au clic
const projectsEditingButton = document.querySelector(
    "#projects_editing_button"
);
projectsEditingButton.addEventListener("click", () => {
    modalOpening(supressionModal);
    supressionModalContent.innerHTML = "";
    fetch(serverUrl + "works")
        .then((value) => {
            if (value.ok) {
                return value.json();
            }
        })
        // Création des cartes des projets dans la modale
        .then((projects) => getAllProjects(projects, modalCardCreation))

        // MEP de la possibilité de supprimer un projet au clic sur l'icone de chaque carte
        .then(() => {
            let trashIcons = supressionModalContent.querySelectorAll(
                ".project_supression_trigger"
            );
            trashIcons.forEach((icon) => {
                icon.addEventListener("click", () => {
                    let projectId = icon.closest(".editing_card").dataset.id;
                    projectSupression(projectId);
                });
            });
        })

        // MEP de la possibilité de supprimer tous les projets
        .then(() => {
            const gallerySupressionTrigger = document.querySelector(
                ".gallery_supression_trigger"
            );
            gallerySupressionTrigger.addEventListener(
                "click",
                allProjectsSupression
            );
        })
        .catch((err) => {
            console.log(err);
        });
});

// Ouverture de la addingModal au clic
const addingModalTrigger = supressionModal.querySelector("input");
addingModalTrigger.addEventListener("click", () => {
    modalClosing(supressionModal);
    modalOpening(addingModal);

    // Affichage de l'image chargée dans son conteneur
    const imageInput = addingModal.querySelector("#image_upload");
    displayImage(imageInput, uploadedImageContainer);

    // Modification du style du bouton submit quand formulaire rempli
    const submitButton = addingModal.querySelector('input[type="submit"]');
    const modalForm = addingModal.querySelector("form");
    modalForm.addEventListener("input", () => toggleButtonStyle(submitButton));

    // Envoi du nouveau projet sur le serveur
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const projectData = new FormData(modalForm);
        fetch(serverUrl + "works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.token,
            },
            body: projectData,
        })
            .then((response) => {
                // Traiter la reponse pour informer l'utilisateur
            })
            .then((projects) => {
                getAllProjects(projects, cardCreation);
                filtersApplication();
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

//Fermeture des modales au clic
const previousModalIcon = document.querySelector(".previous_icon");
previousModalIcon.addEventListener("click", () => {
    modalClosing(addingModal);
    modalOpening(supressionModal);
});

overlay.addEventListener("click", () => {
    modalClosing(supressionModal);
    modalClosing(addingModal);
    formClearing();
});

const modalClosingIcon = document.querySelectorAll(".modal_closing_icon");
modalClosingIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        modalClosing(supressionModal);
        modalClosing(addingModal);
        formClearing();
    });
});
