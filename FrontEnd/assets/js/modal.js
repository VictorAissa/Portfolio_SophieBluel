const modalContainer = document.querySelector(".modal_container");
const modalTriggers = document.querySelectorAll(".modal_trigger");

modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", function (e) {
        modalContainer.classList.toggle("active");
    })
);
