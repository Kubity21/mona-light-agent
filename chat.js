(async () => {
  await new Promise(resolve => {
    if (window.ChatKit) return resolve();
    const script = document.querySelector('script[src*="chatkit.js"]');
    script.addEventListener('load', resolve);
  });

  const getClientSecret = async () => {
    const response = await fetch('https://lucky-violet-3dad.jan-kubat.workers.dev/api/chatkit/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: crypto.randomUUID() })
    });

    const data = await response.json();
    return data.client_secret;
  };

  const chatkit = new ChatKit({
    clientSecretProvider: getClientSecret,
    workflowId: 'wf_6931833ef79c8190b035bce3920e708c0855a7f430e8ee58', // verze="3"
    theme: {
      color: {
        primary: '#007AFF',
        background: '#FFFFFF',
        text: '#000000',
        messageBot: '#F1F1F1',
      }
    }
  });

  chatkit.mount('#chat-container');
})();
