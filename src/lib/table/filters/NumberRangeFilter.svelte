<script context="module" lang="ts">
  export const isNumber = (value:any) => typeof value === 'number';
</script>

<script>
  export let filterValue;
  export let values;
  $: min = $values.length === 0 ? 0 : Math.min(...$values.filter(isNumber));
  $: max = $values.length === 0 ? 0 : Math.max(...$values.filter(isNumber));
</script>

<div>
  <input
    type="number"
    bind:value={$filterValue[0]}
    on:click|stopPropagation
    placeholder="Min ({min})"
  />
  to
  <input
    type="number"
    bind:value={$filterValue[1]}
    on:click|stopPropagation
    placeholder="Max ({max})"
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
  input {
    width: 5rem;
  }
</style>
