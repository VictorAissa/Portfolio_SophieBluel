const gallery = document.querySelector(".gallery");

const projectsCreation = (project) => {
    const card = document.createElement("figure");
    /*Création des images*/
    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.crossOrigin = "anonymous";
    image.alt = project.title;
    /*/*Création des descriptions*/
    const description = document.createElement("figcaption");
    description.textContent = project.title;
    /*Insertion des cards et de leur contenu dans le DOM*/
    gallery.appendChild(card);
    card.appendChild(image);
    card.appendChild(description);
};

fetch("http://localhost:5678/api/works")
    .then((result) => {
        if (result.ok) {
            return result.json();
        }
    })
    .then((value) => {
        const projects = value;
        projects.forEach((project) => {
            projectsCreation(project);
        });
    })
    .catch((err) => {
        console.log(err);
    });
