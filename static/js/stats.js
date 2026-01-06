document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".stat-box").forEach(box => {
        box.innerHTML += "<p style='color:#94a3b8;'>Loading data...</p>";
    });
});
