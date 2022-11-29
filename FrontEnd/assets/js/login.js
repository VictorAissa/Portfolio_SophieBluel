const serverUrl = "http://localhost:5678/api/";

let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");
let form = document.querySelector("form");
const loggedUserData = {
    userId: "",
    token: "",
};

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
        .then((response) => {
            if (response.ok === false) {
                if (response.status === 404) alert("L'adresse mail est fausse");
                if (response.status === 401) alert("Le mdp est faux");
            } else {
                alert("Vous êtes connecté");
                return response.json();
            }
        })
        .then((data) => {
            loggedUserData.userId = data.userId;
            loggedUserData.token = data.token;
            localStorage.setItem("id", data.userId);
            localStorage.setItem("token", data.token);
            document.location.href =
                "http://127.0.0.1:5500/FrontEnd/index.html";
        })
        .catch((error) => {
            console.log(error);
        });
});
localStorage.clear();
