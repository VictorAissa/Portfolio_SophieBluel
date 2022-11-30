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
        //Affichage des messages d'erreurs selon validité des champs remplis
        .then((response) => {
            if (response.ok === false) {
                if (response.status === 404) alert("L'adresse mail est fausse");
                if (response.status === 401) alert("Le mdp est faux");
            } else {
                alert("Vous êtes connecté");
                return response.json();
            }
        })
        //Stockage des userId et token puis redirection vers page d'accueil
        .then((data) => {
            localStorage.setItem("id", data.userId);
            localStorage.setItem("token", data.token);
            document.location.href =
                "http://127.0.0.1:5500/FrontEnd/index.html";
        })
        .catch((error) => {
            console.log(error);
        });
});
