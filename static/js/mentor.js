const input = document.querySelector(".chat-input input");
const button = document.querySelector(".chat-input button");
const chatBox = document.querySelector(".chat-box");

button.addEventListener("click", () => {
    if (!input.value) return;

    const userMsg = document.createElement("div");
    userMsg.className = "msg user";
    userMsg.textContent = input.value;

    chatBox.appendChild(userMsg);

    const aiMsg = document.createElement("div");
    aiMsg.className = "msg ai";
    aiMsg.textContent = "AI is thinking...";

    chatBox.appendChild(aiMsg);

    input.value = "";
});
