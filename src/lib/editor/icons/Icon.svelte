<script context="module" lang="ts">
	import north_west from './north_west.svelte';
	import south_east from './south_east.svelte';
	import gateway_parallel from './gateway_parallel.svelte';
	import gateway_eventbased from './gateway_eventbased.svelte';
	import gateway_xor from './gateway_xor.svelte';
</script>

<script lang="ts">
	export let width = '18';
	export let icon: keyof typeof icons;
	export let viewbox = "0 -960 960 960"
	export let fill = 'blue'
	export let draggable = false

	export let iconMouseEnter = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id
		if(!id.includes("path"))
			id = 'path-'+id
		const path = document.getElementById(id)
		if(path)
			path.style.fill = 'red'
	}

	export let iconMouseLeave = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(!id.includes("path"))
			id = 'path-'+id
		const path = document.getElementById(id)
		
		if(path)
			path.style.fill = fill
	}

	export let iconClick = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(id.includes("path-")){
			const split = id.split('-')
			id = split[1]
		}
		console.log("ICON CLICKED - START DRAG",id)
	}

	export let iconDragStart = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(id.includes("div-")){
			const split = id.split('-')
			id = split[1]
		}
		console.log("ICON START DREAG",id)
	}

	const icons = {
		north_west,
		south_east,
		gateway_parallel,
		gateway_eventbased,
		gateway_xor,
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class='icon-div-class' id={"div-"+icon} draggable="true" on:dragstart={iconDragStart}>
	<svg id={icon} xmlns="http://www.w3.org/2000/svg" 
		height={width}  
		viewBox={viewbox} 
		{width} 
		on:mouseenter={iconMouseEnter} 
		on:mouseleave={iconMouseLeave} 
		on:click={iconClick}>
		<svelte:component this={icons[icon]} fill={fill} id={icon}/>
	</svg>
</div>

<style>
	.icon-div-class{
		cursor:pointer;
	}
	
</style>