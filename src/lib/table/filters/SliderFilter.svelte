<script context="module">
  export const isNumber = (value) => typeof value === 'number';
</script>

<script lang="ts">
  export let filterValue;
  export let preFilteredValues;
  $: min = $preFilteredValues.length === 0 ? 0 : Math.min(...$preFilteredValues.filter(isNumber));
  $: max = $preFilteredValues.length === 0 ? 0 : Math.max(...$preFilteredValues.filter(isNumber));
</script>

<input type="range" {min} {max} bind:value={$filterValue} on:click|stopPropagation />
