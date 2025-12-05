document.getElementById("startBtn").onclick = async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  if (!apiKey) return alert("Zadej API key!");

  const workflow = {
    id: "wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58",
    version: "3"
  };

  const workerUrl = "https://lucky-violet-3dad.jan-kubat.workers.dev";

  const res = await fetch(workerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey
    },
    body: JSON.stringify({
      workflow,
      input: { message: "Ahoj!" },
      session: {},
      client: {}
    })
  });

  const data = await res.json();

  console.log("Server response:", data);

  if (data.client_secret) {
    document.getElementById("log").innerHTML =
      "Client secret získán:<br><code>" + data.client_secret + "</code>";
  } else {
    document.getElementById("log").innerHTML =
      "Chyba:<br><code>" + JSON.stringify(data, null, 2) + "</code>";
  }
};
