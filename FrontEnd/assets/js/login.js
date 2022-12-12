const serverUrl = "http://localhost:5678/api/";

let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");
let form = document.querySelector("form");

//Envoi des données du formulaire au clic sur input
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = {
        email: emailInput.value,
        password: passwordInput.value,
    };
    fetch(serverUrl + "users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user),
    })
        // Affichage des messages d'erreurs
        .then((response) => {
            if (!response.ok) {
                // Supression de l'éventuel errorContainer existant dans le DOM
                let ExistingErrorContainer =
                    document.querySelector(".error_container");
                if (ExistingErrorContainer) {
                    form.removeChild(ExistingErrorContainer);
                }

                // Création du conteneur et affichage des erreurs correspondantes
                var errorContainer = document.createElement("div");
                errorContainer.classList.add("error_container");
                const connexionInput = form.querySelector(
                    'input[type="submit"]'
                );
                form.insertBefore(errorContainer, connexionInput);

                if (response.status === 404) {
                    errorContainer.innerText =
                        "L'adresse mail n'est pas reconnue !";
                }
                if (response.status === 401) {
                    errorContainer.innerText = "Mot de passe erroné !";
                }
            } else {
                return response.json();
            }
        })
        //Stockage des userId et token puis redirection vers page d'accueil
        .then((data) => {
            localStorage.setItem("id", data.userId);
            localStorage.setItem("token", data.token);
            document.location.href = "index.html";
        })
        .catch((error) => {
            console.log(error);
        });
});
