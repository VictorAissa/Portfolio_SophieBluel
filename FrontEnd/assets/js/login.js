const serverUrl = "http://localhost:5678/api/";

let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");
let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
    e.preventDefault();
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
            console.log(response);
            alert(response.statusText);
            /*if (response.ok === true) 
            else*/
        })
        .catch((error) => {
            alert("Une erreur est survenue");
        });
});
