<script lang="ts">
    // EXTERNAL
	import { onMount, onDestroy } from 'svelte';
    import {Svelvet, Node,Anchor,Edge} from 'svelvet';
	import EditorMenu from './EditorMenu.svelte'
	import TestMenu from './TestMenu.svelte'
	// INTERNAL - HERE CUSTOM NODES
	import Icon from './icons/Icon.svelte'
	import {customDefaultNodes} from './graphstore.js'
	// Props
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let translation:any = { x: 0, y: 0 };
	export let controls = false;
	export let edge:any = null;
	export let edgeStyle:any = 'bezier';
	export let snapTo = 0;
	export let editable = false;
	export let fitView: boolean | 'resize' = false;
	export let locked = false;
	export let zoom = 1;
	export let theme = 'light';
	export let mermaid = '';
	export let mermaidConfig:any = {};
	export let TD = false;
	export let disableSelection = false;
	export let raiseEdgesOnSelect: boolean | 'source' | 'target' = false;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';
	export let trackpadPan = false;
	export let toggle = false;


	// Store props in object to be passed to svelvet
	const svelvetProps = {
		width,
		height,
		minimap,
		translation,
		controls,
		edge,
		edgeStyle,
		snapTo,
		editable,
		fitView,
		locked,
		zoom,
		theme,
		mermaid,
		mermaidConfig,
		TD,
		disableSelection,
		raiseEdgesOnSelect,
		modifier,
		trackpadPan,
		toggle
	};

	let defaultNodes:any = [];
	let dropped_in: boolean;
	let drawer = true
	let drawerComponent = TestMenu
	let iconwidth = '60'
	let fill = 'grey'

	// Drag and drop events
	const handleDragEnter = (): void => {
		if (!dropped_in) dropped_in = true;
	};

	const handleDragLeave = (): void => {
		dropped_in = false;
	};

	const onDragOver = (e: DragEvent): boolean => {
		e.preventDefault();
		return false;
	};

	const handleDrop = (e: MouseEvent): void => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		const target = e.target as HTMLElement;
		target.dispatchEvent(moveEvent);
		console.log("HANDLE DROP **********",target,$customDefaultNodes)

		defaultNodes = $customDefaultNodes;
	};
	const nodeClicked = (ev:any)=>{
		ev.preventDefault()
		console.log("NODE CLICKED")
	}
	const nodeReleased = (ev:any)=>{
		ev.preventDefault()
		console.log("NODE RELEASED")
	}

	const anchorConnection = (ev:any)=>{
		ev.preventDefault()
		console.log("ANCHOR CONNECTED",ev)
	}
	
	
</script>


<div role="presentation"
		class="drop_zone"
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:dragover={onDragOver}
		on:drop={handleDrop}>
		<Svelvet id='1' {...svelvetProps}>
			{#each defaultNodes as { anchors, edgeProps, ...nodeProps }}
					<Node {...nodeProps} drop="cursor" on:nodeClicked={nodeClicked} on:nodeReleased={nodeReleased}>
						{#if anchors}
							{#each anchors as AnchorProps}
									<Anchor {...AnchorProps} on:connection={anchorConnection}/>
							{/each}
						{/if}
						{#if nodeProps.customnode}
							<Icon  uid={nodeProps.uid} icon={nodeProps.customnode} width={nodeProps.width} viewbox="0 0 2048 2048" fill={nodeProps.fillColor}/>
						{/if}
					</Node>
			{/each}
			<slot name="minimap" slot="minimap" />
			<slot name="controls" slot="controls" />
			<slot name="toggle" slot="toggle" />
		</Svelvet>
		{#if drawer}
				<svelte:component this={drawerComponent} />
		{/if}
</div>



<style>
.drop_zone {
	box-shadow: none;
}
:root[svelvet-theme='light'] {
	--anchor-color: #ffff00;
	--anchor-border-color: #999999;
	--anchor-connected: #0000ff;
	--node-selection-color: #00FF00;
}

</style>