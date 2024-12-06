<script>
  export let text = '';
  let errorMessage = '';
  let audioURL = '';

  const sendTextToServer = async () => {
    errorMessage = '';
    audioURL = '';

    if (!text.trim()) {
      errorMessage = 'Inserisci un testo valido.';
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const blob = await response.blob();
        audioURL = URL.createObjectURL(blob);
      } else {
        errorMessage = 'Errore durante la generazione del file audio.';
      }
    } catch (err) {
      errorMessage = 'Errore di connessione al server.';
    }
  };
</script>

<style>
  button {
    margin: 10px;
    padding: 10px;
    font-size: 16px;
  }
  textarea {
    width: 100%;
    height: 80px;
    font-size: 16px;
    margin: 10px 0;
  }
</style>

<div>
  <h2>Testo a voce</h2>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}

  <textarea bind:value={text} placeholder="Inserisci il testo..."></textarea>
  <button on:click={sendTextToServer}>Invia</button>

  {#if audioURL}
    <audio controls>
      <source src={audioURL} type="audio/mpeg" />
      Il tuo browser non supporta l'audio HTML.
    </audio>
  {/if}
</div>
