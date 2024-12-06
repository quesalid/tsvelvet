<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  const dndObject = writable({type:null,color:null,origin:null})

  setContext('dnd',dndObject)

  onDestroy(() => {
    dndObject.set(null)
  });
</script>

<slot />
