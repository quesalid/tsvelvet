<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import {customDefaultNodes} from '../graphstore'

	onMount(async () => {
		// CLEAR STORE
	})

	import {north_west,
			south_east,
			gateway_eventbased,
			gateway_parallel,
			gateway_xor,
			subprocess_expanded} from '.';

	const icons = {
		north_west,
		south_east,
		gateway_parallel,
		gateway_eventbased,
		gateway_xor,
		subprocess_expanded,
	};

	export let width = '18';
	export let icon: keyof typeof icons;
	export let viewbox = "0 -960 960 960"
	export let fill = 'blue'
	export let draggable = true
	export let uid = ''

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
			const Z = id.replace("path-", '');
			id = Z
		}
		// KEEP TRACK OF NODE MOVE
		const found = $customDefaultNodes.find((item:any) => (item.customnode+item.uid)==id)
		if(found){
			found.iconPosition.x = ev.clientX
			found.iconPosition.y = ev.clientY
		}
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

	export let iconDragEnd = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(id.includes("div-")){
			const split = id.split('-')
			id = split[1]
		}
		console.log("ICON DRAG END",id)
	}

	export let iconContext = (ev:any) =>{
		ev.preventDefault()
		ev.stopImmediatePropagation()
		const target = ev.target
		let id = ev.target.id

		if(id.includes("div-")){
			const split = id.split('-')
			id = split[1]
		}
		console.log("ICON CONTEXT",id)
	}

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class='icon-div-class' id={"div-"+icon+uid} draggable="{draggable}" on:dragend={iconDragEnd} on:dragstart={iconDragStart} on:contextmenu={iconContext}>
	<svg id={icon+uid} xmlns="http://www.w3.org/2000/svg" 
		height={width}  
		viewBox={viewbox} 
		{width} 
		on:mouseenter={iconMouseEnter} 
		on:mouseleave={iconMouseLeave} 
		on:click={iconClick}>
		<svelte:component this={icons[icon]} fill={fill} id={icon+uid}/>
	</svg>
</div>

<style>
	.icon-div-class{
		cursor:pointer;
	}
	
</style>