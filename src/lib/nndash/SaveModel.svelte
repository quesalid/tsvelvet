<script lang="ts">
  import './nnstyle.css'
  export let net;
  const saveModel = () => {
    const json = net.toJSON();
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.json';
    a.click();
  };
</script>
<div class="neural-save-class">
<h2>D. Save network</h2>
<button on:click={saveModel}>Save Model</button>
</div>

