<script lang="ts">
	import { Edge } from 'svelvet';
	import { tick } from 'svelte';


	const edgeClicked = ()=>{
		console.log("EDGE CLICKED")
	}

	export let label = "Custom Label"
	export let button = false
	export let isBidirectional = false
	export let destroyEdge
</script>

	<Edge  let:path let:destroy  >
			<button  class="edge-button" on:click={destroyEdge} slot="label">
				{label}
			</button>
	</Edge>

<style>
	path {
		stroke: rgb(120, 120, 120);
		stroke-width: 3px;
		z-index: 4;
	}
	.edge-button{
		border: 1px solid;
		font-size:x-small;
	}
	.edge-button:hover{
		border: 2px solid;
		border-color: #f00;
	}
</style>
