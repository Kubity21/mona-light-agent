const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev/";
const WORKFLOW_ID = "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58";
const WORKFLOW_VERSION = "3";

const apiKeyInput = document.getElementById("apiKey");
const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chat-container");
const errorBox = document.getElementById("errorBox");

function appendMessage(text, who = "assistant") {
    const div = document.createElement("div");
    div.className = who === "user" ? "msg-user" : "msg-assistant";
    div.textContent = (who === "user" ? "🧑 " : "🤖 ") + text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

startBtn.onclick = async () => {
    errorBox.textContent = "";
    chatBox.innerHTML = "ChatKit · MonaLIGHT workflow<br/>Připojuji…";

    let apiKey = apiKeyInput.value.trim();

    if (!apiKey.startsWith("sk-")) {
        errorBox.textContent = "❌ Incorrect API key format.";
        return;
    }

    try {
        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey
            },
            body: JSON.stringify({
                workflow: {
                    id: WORKFLOW_ID,
                    version: WORKFLOW_VERSION,
                },
                session: {
                    messages: [
                        { role: "user", content: "start" }
                    ]
                },
                client: {
                    info: "web-client"
                }
            })
        });

        const result = await res.json();

        if (result.error) {
            errorBox.textContent = JSON.stringify(result.error, null, 2);
            return;
        }

        if (result.openai_raw) {
            // Raw obsahuje JSON string → parse
            const parsed = JSON.parse(result.openai_raw);

            if (parsed.output_text) {
                chatBox.innerHTML = "";
                appendMessage(parsed.output_text, "assistant");
            } else {
                appendMessage("Workflow odpověděl bez textového výstupu.");
            }
        }

    } catch (err) {
        errorBox.textContent = "Client error: " + err.message;
    }
};
