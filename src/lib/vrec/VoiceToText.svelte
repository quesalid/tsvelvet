<script>
  import { onMount } from 'svelte';
  let recording = false;
  let audioChunks = [];
  let mediaRecorder;
  export let transcript = '';
  let errorMessage = '';

 

  onMount(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          audioChunks = [];
          try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.wav');
            formData.forEach((value, key) => {
                    console.log(`FORM DATA ${key}: ${value}`);
            });
            const response = await fetch('http://127.0.0.1:5000/transcribe', {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              transcript = data.transcription;
            } else {
              errorMessage = 'Errore durante la trascrizione.';
            }
          } catch (err) {
            errorMessage = 'Errore di connessione al server.';
          }
        };
      })
      .catch(() => {
        errorMessage = 'Impossibile accedere al microfono.';
      });
  });

  const startRecording = () => {
    console.log("START RECORDING");
    recording = true;
    audioChunks = [];
    mediaRecorder.start();
  };

  const stopRecording = () => {
    console.log("STOP RECORDING");
    recording = false;
    mediaRecorder.stop();
  };
</script>

<style>
  button {
    margin: 10px;
    padding: 10px;
    font-size: 16px;
  }
  p {
    font-size: 18px;
  }
</style>

<div>
  <h2>Comando vocale</h2>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}

  <button on:click={startRecording} disabled={recording}>Inizia registrazione</button>
  <button on:click={stopRecording} disabled={!recording}>Termina registrazione</button>

  {#if transcript}
    <p>Testo trascritto: {transcript}</p>
  {/if}
</div>
