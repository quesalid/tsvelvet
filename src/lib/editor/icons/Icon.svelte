<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import IconMenu from './IconMenu.svelte'
	import IconTitle from './IconTitle.svelte'

	onMount(async () => {
		// CLEAR STORE
	})

	import {north_west,
			south_east,
			gateway_eventbased,
			gateway_parallel,
			gateway_xor,
			subprocess_expanded,
			start_event,
			end_event,
			start_timer,
			user_task,
			rule_task,
			script_task,
			} from '.';

	const icons = {
		north_west,
		south_east,
		gateway_parallel,
		gateway_eventbased,
		gateway_xor,
		subprocess_expanded,
		start_event,
		end_event,
		start_timer,
		user_task,
		rule_task,
		script_task
	};

	export let width = '18';
	export let icon: keyof typeof icons;
	export let viewbox = "0 -960 960 960"
	export let fill = 'blue'
	export let draggable = true
	export let uid = ''
	export let menu = false
	export let title = false

	export let iconMouseEnter = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id
		if(!id.includes("path"))
			id = 'path-'+id
		const path = document.getElementById(id)
		if(path){
			//path.style.fill = 'red'
		}
	}

	export let iconMouseLeave = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(!id.includes("path"))
			id = 'path-'+id
		const path = document.getElementById(id)
		
		if(path){
			//path.style.fill = fill
		}
	}

	export let iconClick = (ev:any) =>{
		console.log("ICON CLICK")
	}

	export let iconRelease = (ev:any) =>{
		console.log("ICON RELEASE")
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

		// KEEP TRACK OF NODE DELETE AND NODE DATA
	}

	

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class='icon-div-class' style="--width:{width}"
		id={"div-"+icon+uid} 
		draggable="{draggable}" 
		on:dragstart={iconDragStart}
		on:contextmenu={iconContext}
		on:mouseup={iconRelease}>
		{#if menu}
			<IconMenu uid={uid}/>
		{/if}
		<svg id={icon+uid} xmlns="http://www.w3.org/2000/svg" 
			height={width}  
			viewBox={viewbox} 
			{width}
			on:mouseenter={iconMouseEnter} 
			on:mouseleave={iconMouseLeave} 
			on:click={iconClick}>
			<svelte:component this={icons[icon]} fill={fill} id={icon+uid}/>
		</svg>
		{#if title}
			<IconTitle uid={uid}/>
		{/if}
</div>

<style>
	.icon-div-class{
		cursor:gr;
		width:var(--width);
	}
	
</style>