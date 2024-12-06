<script lang="ts">
  import { useEdges, useNodes } from '@xyflow/svelte';
  import './flowstyles.css'

  export let onClick: () => void;
  export let id: string;
  export let top: number | undefined;
  export let left: number | undefined;
  export let right: number | undefined;
  export let bottom: number | undefined;

  const nodes = useNodes();
  const edges = useEdges();


  function deleteNode() {
    $nodes = $nodes.filter((node) => node.id !== id);
    $edges = $edges.filter((edge) => edge.source !== id && edge.target !== id);
  }
  function editNode() {
      console.log('edit node');
      // show NodePanel
      const nodePanel = document.getElementById('NodePanelId')
      const editClicked = new CustomEvent("shownodepanel", { detail: id })
      nodePanel?.dispatchEvent(editClicked)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
  class="context-menu"
  on:click={onClick}
>
  <p style="margin: 0.5em;">
    <small>node: {id}</small>
  </p>
  <!--button on:click={duplicateNode}>duplicate</!--button-->
  <button on:click={deleteNode}>delete</button>
  <button on:click={editNode}>edit</button>
</div>

<style>
</style>