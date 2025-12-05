document.getElementById("startBtn").onclick = async () => {
    const apiKey = document.getElementById("apiKey").value;
    const out = document.getElementById("chat-container");
    const errBox = document.getElementById("errorBox");

    errBox.textContent = "";
    out.innerHTML = "ChatKit · MonaLIGHT workflow<br> Připojuji…";

    try {
        const response = await fetch(
            "https://lucky-violet-3dad.jan-kubat.workers.dev/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": apiKey
                },
                body: JSON.stringify({
                    workflow: {
                        id: "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58",
                        version: "3"
                    },
                    user_input: "start"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            errBox.textContent = JSON.stringify(data, null, 2);
            return;
        }

        out.innerHTML = `
            Session: ${data.session.id}<br>
            Odpověď: ${data.reply?.content?.[0]?.text || "—"}
        `;

    } catch (e) {
        errBox.textContent = e.message;
    }
};
