// ----------------------------------------
// MonaLIGHT – ChatKit Client
// ----------------------------------------

const apiKeyInput = document.getElementById("apiKey");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const chatStateEl = document.getElementById("chatState");
const chatEl = document.getElementById("chat");

// URL na tvůj Cloudflare Worker
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev/";

// ------------------------------
// UI Helpers
// ------------------------------
function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

function setChatState(msg) {
  chatStateEl.textContent = msg;
}

function disableUI(disabled) {
  startBtn.disabled = disabled;
  apiKeyInput.disabled = disabled;
}

// ------------------------------
// Session creation via Worker
// ------------------------------
async function createSession(apiKey) {
  const payload = { apiKey };

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Worker error: ${res.status}`);
  }

  return res.json(); // { clientSecret }
}

// ------------------------------
// Start Chat
// ------------------------------
startBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();

  // Validate optional key
  if (apiKey && !apiKey.startsWith("sk-")) {
    setStatus("Neplatný formát API klíče.", "error");
    return;
  }

  disableUI(true);
  setStatus("Připojuji…");
  setChatState("Connecting…");

  try {
    const { clientSecret } = await createSession(apiKey);

    if (!clientSecret) {
      throw new Error("Worker nevrátil clientSecret.");
    }

    // Initialize ChatKit hosted UI
    chatEl.clientSecret = clientSecret;

    setStatus("Připojeno ✔️", "ok");
    setChatState("Online");
  }
  catch (err) {
    console.error(err);
    setStatus("Chyba připojení: " + err.message, "error");
    setChatState("Chyba");
  }
  finally {
    disableUI(false);
  }
});
