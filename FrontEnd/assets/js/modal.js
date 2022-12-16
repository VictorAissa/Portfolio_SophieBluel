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

// Fonctions de gestion d'ouverture/fermeture des modales
const openModal = (modal) => {
    overlay.classList.add("active");
    modal.classList.add("active");
};

const closeModal = (modal) => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
};

// Fonction de création des cartes de la modale
const createModalCard = (project) => {
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
const deleteProject = (projectNumber) => {
    fetch(serverUrl + "works" + "/" + projectNumber, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + "" + localStorage.token,
            "Content-Type": "application/json;charset=utf-8",
        },
    });
};

const deleteAllProjects = () => {
    const cards = supressionModalContent.querySelectorAll(".editing_card");
    cards.forEach((card) => {
        deleteProject(card.dataset.id);
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
        reader.readAsDataURL(imageInput.files[0]);
        imageContainer.style.display = "block";
    });
};

const image = addingModal.querySelector("#image_upload");
const title = addingModal.querySelector("#title_input");
const category = addingModal.querySelector("#category_input");

const toggleButtonStyle = (button) => {
    if (image.value && title.value && category.value) {
        button.classList.remove("inactive_button");
    } else {
        button.classList.add("inactive_button");
    }
};

const displayedImageContainer = addingModal.querySelector(".image_display");

function clearForm() {
    modalForm.reset();
    displayedImageContainer.style.backgroundImage = "";
    displayedImageContainer.style.display = "none";
    let ExistingErrorContainer = document.querySelector(".error_container");
    if (ExistingErrorContainer) {
        modalForm.removeChild(ExistingErrorContainer);
    }
}

// Ouverture de la supressionModal au clic
const projectsEditingButton = document.querySelector(
    "#projects_editing_button"
);
projectsEditingButton.addEventListener("click", () => {
    openModal(supressionModal);

    // Nettoyage du contenu de la modale puis création des cartes
    supressionModalContent.innerHTML = "";
    fetch(serverUrl + "works")
        .then((value) => {
            if (value.ok) {
                return value.json();
            }
        })
        .then((projects) => getAllProjects(projects, createModalCard))

        .then(() => {
            // MEP de la possibilité de supprimer un projet au clic sur l'icone de chaque carte
            let trashIcons = supressionModalContent.querySelectorAll(
                ".project_supression_trigger"
            );
            trashIcons.forEach((icon) => {
                icon.addEventListener("click", () => {
                    let projectId = icon.closest(".editing_card").dataset.id;
                    deleteProject(projectId);
                });
            });

            // MEP de la possibilité de supprimer tous les projets
            const gallerySupressionTrigger = document.querySelector(
                ".gallery_supression_trigger"
            );
            gallerySupressionTrigger.addEventListener(
                "click",
                deleteAllProjects
            );
        })

        // Nettoyage et chargement des projets depuis le serveur
        .then(() => {
            gallery.innerHTML = "";
            fetch(serverUrl + "works")
                .then((value) => {
                    if (value.ok) {
                        return value.json();
                    }
                })
                .then((projects) => {
                    getAllProjects(projects, createCard);
                    applyFilters();
                });
        })

        .catch((err) => {
            console.log(err);
        });
});

// Ouverture de la addingModal au clic
const addingModalTrigger = supressionModal.querySelector("input");
addingModalTrigger.addEventListener("click", () => {
    closeModal(supressionModal);
    openModal(addingModal);
});

// Affichage de l'image chargée dans son conteneur
const imageInput = addingModal.querySelector("#image_upload");
displayImage(imageInput, displayedImageContainer);

// Modification du style du bouton submit quand formulaire rempli
const submitButton = addingModal.querySelector('input[type="submit"]');
const modalForm = addingModal.querySelector("form");
modalForm.addEventListener("input", () => toggleButtonStyle(submitButton));

// Envoi du nouveau projet
modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectData = new FormData(modalForm);

    // Gestion des erreurs de saisie dans le formulaire
    if (
        !projectData.get("image").name ||
        !projectData.get("title") ||
        !projectData.get("category")
    ) {
        let ExistingErrorContainer = document.querySelector(".error_container");
        if (ExistingErrorContainer) {
            modalForm.removeChild(ExistingErrorContainer);
        }

        // Création du conteneur et affichage des erreurs correspondantes
        const errorContainer = document.createElement("div");
        errorContainer.classList.add("error_container");
        const connexionInput = modalForm.querySelector('input[type="submit"]');
        modalForm.insertBefore(errorContainer, connexionInput);

        if (!projectData.get("image").name) {
            errorContainer.innerText = "Choisissez une image !";
        }
        if (!projectData.get("title")) {
            errorContainer.innerText = "Renseignez un titre !";
        }
        if (!projectData.get("category")) {
            errorContainer.innerText = "Choisissez une catégorie !";
        }
    } else {
        // Envoi du projet au serveur
        fetch(serverUrl + "works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.token,
            },
            body: projectData,
        })
            .then(() => {
                // Nettoyage et chargement des projets depuis le serveur
                gallery.innerHTML = "";
                fetch(serverUrl + "works")
                    .then((value) => {
                        if (value.ok) {
                            return value.json();
                        }
                    })
                    .then((projects) => {
                        getAllProjects(projects, createCard);
                        applyFilters();
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

//Fermeture des modales au clic
const previousModalIcon = document.querySelector(".previous_icon");
previousModalIcon.addEventListener("click", () => {
    closeModal(addingModal);
    openModal(supressionModal);
});

overlay.addEventListener("click", () => {
    closeModal(supressionModal);
    closeModal(addingModal);
    clearForm();
    toggleButtonStyle(submitButton);
});

const modalClosingIcon = document.querySelectorAll(".modal_closing_icon");
modalClosingIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        closeModal(supressionModal);
        closeModal(addingModal);
        clearForm();
        toggleButtonStyle(submitButton);
    });
});
