const body = document.querySelector("body");
const header = document.querySelector("body > header");
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

//Gestion de la modale au clic

const supressionModal = document.querySelector("#supression_modal");
const addingModal = document.querySelector("#adding_modal");
const overlay = document.querySelector(".overlay");
const supressionModalContent = document.querySelector(
    "#supression_modal .modal_content"
);
const projectsEditingButton = document.querySelector(
    "#projects_editing_button"
);
const modalClosingIcon = document.querySelectorAll(".modal_closing_icon");
const previousModalIcon = document.querySelector(".previous_icon");
const addingModalTrigger = document.querySelector("#supression_modal input");
const gallerySupressionTrigger = document.querySelector(
    ".gallery_supression_trigger"
);
const modalForm = addingModal.querySelector("form");
const image = addingModal.querySelector("#image_upload");
const title = addingModal.querySelector("#title_input");
const category = addingModal.querySelector("#category_input");

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

const projectSupression = () => {
    let trashIcons = supressionModalContent.querySelectorAll(
        ".project_supression_trigger"
    );

    trashIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            let projectId = icon
                .closest(".editing_card")
                .getAttribute("data-id");
            fetch(serverUrl + "works" + "/" + projectId, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + "" + localStorage.token,
                    "Content-Type": "application/json;charset=utf-8",
                },
            })
                .then((response) => {
                    // afficher succes de la supression
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
                        });
                });
        });
    });
};

const allProjectsSupression = () => {
    gallerySupressionTrigger.addEventListener("click", () => {
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
                    // afficher succes de la supression
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
                        });
                });
        });
    });
};

const modalOpening = (modal) => {
    overlay.classList.add("active");
    modal.classList.add("active");
};

const modalClosing = (modal) => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
};

const displayImage = () => {
    const imageInput = addingModal.querySelector("#image_upload");
    let uploadedImage = "";
    imageInput.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            uploadedImage = reader.result;
            addingModal.querySelector(
                ".image_upload_container"
            ).style.backgroundImage = `url(${uploadedImage})`;
        });
        reader.readAsDataURL(this.files[0]);
    });
};

const toggleSubmitButtonStyle = () => {
    const submitButton = addingModal.querySelector('input[type="submit"');
    modalForm.addEventListener("change", () => {
        if (image.value && title.value && category.value) {
            submitButton.classList.remove("inactive_button");
        } else {
            submitButton.classList.add("inactive_button");
        }
    });
};

// Ouverture et gestion de la modale supression au clic
projectsEditingButton.addEventListener("click", () => {
    modalOpening(supressionModal);
    supressionModalContent.innerHTML = "";
    fetch(serverUrl + "works")
        .then((value) => {
            if (value.ok) {
                return value.json();
            }
        })
        .then((projects) => getAllProjects(projects, modalCardCreation))
        .then(() => {
            projectSupression();
            allProjectsSupression();
        })
        .catch((err) => {
            console.log(err);
        });
});

// Ouverture et gestion de la modale adding au clic
addingModalTrigger.addEventListener("click", () => {
    modalClosing(supressionModal);
    modalOpening(addingModal);
    displayImage();
    toggleSubmitButtonStyle();

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
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

//Fermeture des modales au clic
previousModalIcon.addEventListener("click", () => {
    modalClosing(addingModal);
    modalOpening(supressionModal);
});

overlay.addEventListener("click", () => {
    modalClosing(supressionModal);
    modalClosing(addingModal);
});

modalClosingIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        modalClosing(supressionModal);
        modalClosing(addingModal);
    });
});
