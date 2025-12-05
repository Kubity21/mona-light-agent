// script.js — SAFE DOM INITIALIZATION
await new Promise(resolve => {
  if (document.readyState === "complete" || document.readyState === "interactive") resolve();
  else document.addEventListener("DOMContentLoaded", resolve);
});

// --- ELEMENTY ---
const startBtn = document.getElementById("startBtn");
const apiKeyInput = document.getElementById("apiKey");
const statusBox = document.getElementById("status");
const chatState = document.getElementById("chatState");
const chatUI = document.getElementById("chat");

// Debug kontrola
console.log("Loaded elements:", { startBtn, apiKeyInput, statusBox, chatUI });

if (!startBtn) {
  console.error("startBtn NOT FOUND in DOM");
  throw new Error("startBtn not found");
}

// KONSTANTY
const WORKFLOW_ID = "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58";
const WORKFLOW_VERSION = "3";
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev/";

// START CHAT SESSION
startBtn.onclick = async () => {
  statusBox.textContent = "";
  statusBox.className = "status";
  chatState.textContent = "Připojuji…";

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    statusBox.textContent = "❌ Zadej OpenAI API key.";
    statusBox.classList.add("error");
    return;
  }

  try {
    const payload = {
      apiKey,
      workflowId: WORKFLOW_ID,
      version: WORKFLOW_VERSION,
    };

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Worker response:", data);

    if (!res.ok || !data.client_secret) {
      throw new Error(data.error?.message || "Worker nevrátil client_secret");
    }

    chatUI.client = {
      apiKey,
      clientSecret: data.client_secret,
    };

    chatState.textContent = "Připojeno ✔";
  } catch (err) {
    console.error(err);
    statusBox.textContent = "❌ " + err.message;
    statusBox.classList.add("error");
    chatState.textContent = "Chyba";
  }
};
