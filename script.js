// URL tvého Cloudflare Workeru
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev";

const WORKFLOW_ID = "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58";

const apiKeyInput = document.getElementById("apiKey");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const chatStateEl = document.getElementById("chatState");
const chatEl = document.getElementById("chat");

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "status" + (type ? " " + type : "");
}

startBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    alert("Zadej prosím OpenAI API key (sk-proj-…).");
    return;
  }

  startBtn.disabled = true;
  setStatus("Vytvářím ChatKit session přes Worker…");
  chatStateEl.textContent = "Inicializuji…";

  try {
    const userId = "github-pages-" + (crypto.randomUUID?.() || Date.now());

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey, // Worker může místo toho využít vlastní env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        workflowId: WORKFLOW_ID,
        user: userId,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Worker error:", data);
      setStatus("Chyba z Workeru: " + JSON.stringify(data), "error");
      chatStateEl.textContent = "Chyba spojení";
      startBtn.disabled = false;
      return;
    }

    const clientSecret = data.client_secret;
    if (!clientSecret) {
      console.error("Worker response without client_secret:", data);
      setStatus("Worker nevrátil client_secret:\n" + JSON.stringify(data, null, 2), "error");
      chatStateEl.textContent = "Chyba spojení";
      startBtn.disabled = false;
      return;
    }

    // Počkáme na načtení web-komponenty ChatKit
    await customElements.whenDefined("openai-chatkit");

    // Předáme ChatKit konfiguraci – Hosted API s client_secretem z Workeru
    chatEl.setOptions({
      api: {
        // ChatKit si token vyžádá, my mu pořád vrátíme stejný client_secret
        getClientSecret: async () => clientSecret,
      },
      theme: {
        colorScheme: "dark",
        color: {
          accent: { primary: "#2563eb", level: 2 },
        },
      },
      composer: {
        placeholder: "Napiš dotaz pro MonaLIGHT workflow…",
      },
      startScreen: {
        greeting: "Ahoj! Jsem MonaLIGHT workflow. Jak ti můžu pomoct?",
      },
    });

    setStatus("Session vytvořena – můžeš chatovat ✅", "ok");
    chatStateEl.textContent = "Připojeno k workflow";
  } catch (err) {
    console.error(err);
    setStatus("Chyba: " + err.message, "error");
    chatStateEl.textContent = "Chyba spojení";
    startBtn.disabled = false;
  }
});
