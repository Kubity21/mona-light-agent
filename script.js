// Cloudflare Worker endpoint
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev";

// Workflow ID (ten musíš měnit při změně workflow)
const WORKFLOW_ID = "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58";

// API key vložený natvrdo (změň ručně)
const API_KEY = "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";

const startBtn = document.getElementById("startBtn");
const chatEl = document.getElementById("chat");
const statusEl = document.getElementById("status");
const chatStateEl = document.getElementById("chatState");

function setStatus(msg, cls = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + cls;
}

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  chatStateEl.textContent = "Připojuji…";
  setStatus("Vytvářím session přes Worker…");

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        workflowId: WORKFLOW_ID,
        user: "user-" + crypto.randomUUID()
      })
    });

    const data = await res.json();

    if (!data.client_secret) {
      setStatus("Worker nevrátil client_secret: " + JSON.stringify(data), "error");
      startBtn.disabled = false;
      return;
    }

    await customElements.whenDefined("openai-chatkit");

    chatEl.setOptions({
      api: {
        getClientSecret: async () => data.client_secret
      },
      theme: {
        colorScheme: "dark",
        color: { accent: { primary: "#3b82f6" } }
      },
      composer: {
        placeholder: "Zeptej se MonaLIGHT workflow…"
      },
      startScreen: {
        greeting: "Ahoj! Jsem MonaLIGHT workflow. Jak ti můžu pomoci?"
      }
    });

    chatStateEl.textContent = "Připojeno";
    setStatus("Hotovo – můžeš chatovat!", "ok");

  } catch (err) {
    setStatus("Chyba: " + err.message, "error");
    chatStateEl.textContent = "Chyba";
  }

  startBtn.disabled = false;
});
