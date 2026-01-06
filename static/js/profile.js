const form = document.querySelector("form");
const statusText = document.createElement("p");

statusText.style.marginTop = "10px";
statusText.style.color = "#38bdf8";

form.appendChild(statusText);

form.addEventListener("submit", () => {
    statusText.textContent = "Saving handles...";
});
