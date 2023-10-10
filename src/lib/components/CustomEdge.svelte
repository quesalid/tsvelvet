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
		<!-- A marker to be used as an arrowhead -->
			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX="11"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<!--path d="M 0 0 L 10 5 L 0 10 z" fill="#f00"/-->
					<path d="M 0 0 L 10 5 L 0 10 z" fill="#f00"/>
				</marker>
			</defs>
			<path
				d={path}
				marker-start="url(#arrow)"
			/>
			<button  on:click={destroyEdge} slot="label">
				{label}
			</button>
	</Edge>

<style>
	path {
		stroke: rgb(200, 200, 200);
		stroke-width: 2px;
		z-index: 4;
	}
</style>

