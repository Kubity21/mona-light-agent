document.getElementById("runBtn").onclick = async () => {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    const workflowId = document.getElementById("workflowIdInput").value.trim();
    const workflowVersion = document.getElementById("workflowVersionInput").value.trim();

    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (!apiKey) {
        showError("Prosím vlož OpenAI API klíč.");
        return;
    }
    if (!workflowId) {
        showError("Chybí Workflow ID.");
        return;
    }

    try {
        const res = await fetch("https://lucky-violet-3dad.jan-kubat.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey,
            },
            body: JSON.stringify({
                workflow: {
                    id: workflowId,
                    version: workflowVersion
                },
                session: {},
                client: {},
            }),
        });

        const data = await res.json();

        if (data.error || data.raw?.error || res.status !== 200) {
            showError(JSON.stringify(data.error || data.raw || data, null, 2));
        } else {
            showSuccess(JSON.stringify(data, null, 2));
        }

    } catch (err) {
        showError("Došlo k chybě:\n" + err.message);
    }
};

function showError(msg) {
    const box = document.getElementById("errorBox");
    box.textContent = msg;
    box.style.display = "block";
}

function showSuccess(msg) {
    const box = document.getElementById("successBox");
    box.textContent = msg;
    box.style.display = "block";
}
