document.querySelectorAll(".contest-card").forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes("live")) {
        card.style.border = "2px solid #22c55e";
    } else if (text.includes("23 hours")) {
        card.style.border = "2px solid #facc15";
    }
});
