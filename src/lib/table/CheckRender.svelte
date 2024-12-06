<script lang="ts">
 export let isSelected;
 export let isSomeSubRowsSelected;
 export let onClick:any = null
 export let name = 'checkbox'
 export let uid = ''
</script>

<input type="checkbox" id="{name+'-'+uid}" data-uid={uid} bind:checked={$isSelected} indeterminate={$isSomeSubRowsSelected} on:click={onClick?onClick:null} />
