<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Papa from 'papaparse';

  import './nnstyle.css';

  export let dataset:any = [];
  const dispatch = createEventDispatcher();

  let fileInput; // Riferimento all'elemento input file
  let headers = [];

  // Funzione per leggere e parsare il file CSV
  function handleFileUpload() {
    const file = fileInput.files[0]; // Ottieni il file selezionato
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = Papa.parse(reader.result, { header: true, skipEmptyLines: true });
      dataset = parsed.data; // Array di righe (oggetti)
      headers = parsed.meta.fields || []; // Intestazioni della tabella
      dispatch('dataLoaded', { dataset, headers });
    };
    reader.readAsText(file); // Leggi il contenuto del file
  }
</script>

<div class="neural-data-upload-class">
 <h2>B. Data Uploader</h2>
  <input type="file" accept=".csv" bind:this={fileInput} />
  <button on:click={handleFileUpload}>Upload File</button>

  {#if dataset.length > 0}
    <div class="neural-table-container">
      <table>
        <thead>
          <tr>
            {#each headers as header}
              <th>{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each dataset as row}
            <tr>
              {#each headers as header}
                <td>{row[header]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
</style>
