const modalContainer = document.querySelector(".modal_container");
const modalTriggers = document.querySelectorAll(".modal_trigger");
const modalContent = document.querySelector(".modal_content");

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

//Affichage de la modale au clic
modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", (e) => {
        modalContainer.classList.toggle("active");
        if (
            modalContainer.classList.contains("active") === true &&
            !modalContent.querySelector("figure")
        ) {
            projectsArray.forEach((project) => {
                modalCardCreation(project);
            });
        }

        //Supression d'un projet au clic sur la corbeille
        const modalCardsArray = Array.from(
            modalContent.querySelectorAll("figure")
        );

        modalCardsArray.forEach((card) => {
            card.querySelector(".project_supression_trigger").addEventListener(
                "click",
                (e) => {
                    alert("Voulez-vous vraiment supprimer ce projet ?");

                    /*fetch(serverUrl + "works" + "/" + card.dataset.id, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            Authorization: "Bearer " + "" + localStorage.token,
                        },
                    }).then((response) => {
                        response.json();
                        console.log(response);
                    });*/
                }
            );
        });
    })
);
