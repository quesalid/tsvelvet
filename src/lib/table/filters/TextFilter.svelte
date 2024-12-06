<script>
  export let filterValue;
  export let values;
  export let preFilteredValues;
</script>

<label for="filter-input">
  {$values.length} out of {$preFilteredValues.length}
</label>
<input id="filter-input" type="text" bind:value={$filterValue} placeholder="filter..." />

<style>
  input {
    width: 8rem;
    font-size: small;
  }
  label{
      font-size: x-small;
  }
</style>