<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, 
	getArrayFromDistribution, 
	getStatusDistribution,
	updateAllDValues,
	getMeansVariancesWeight} from './GraphUtils'

import GaussParams from './GaussParams.svelte'

export let id: string|any = 'defaultDistributionDefContainer'
export let node: any ={data:[]}

export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("IMPORT DATA")
export let graph = {nodes:[],edges:[]}



let newkey = ''
let index = 0


onMount(async () => {  
    const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);
	if(node.data)
		index = node.data.findIndex((item:any)=>item.distribution)

	dragElement(dragable, dragzone);
	
 })

const closeMenu = async(ev:any)=>{
	// UPDATE ALL DiscreteValue COMPONENTS
	updateAllDValues(document,graph)
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
	// GET MEAN AND VARIANCE ARRAY FROM DISTRIBUTION
	const mv = getMeansVariancesWeight(node,index)
	// UPDATE ContValue COMPONENT 
	const element = document.getElementById('NWC-'+node.id+'-'+node.label)
	if(element){
		const event = new CustomEvent('changevalue', {detail: {mv:mv}})
		element.dispatchEvent(event)
	}
}


let defDist = (ev:any|undefined)=>{
	index = node.data.findIndex((item:any)=>item.distribution)
	const arrayDist = getArrayFromDistribution(node,index)
	const dataset = ev.target.dataset
	const row = dataset.row
	const col = dataset.col
	const status = arrayDist.distarray[row].array[0]
	const variables = arrayDist.header.filter((item:any)=>!item.includes('='))
	const pLength = variables.length
	variables.push(node.label)
	const states = []
	for(let i=0; i<pLength;i++){
		states[i]=arrayDist.distarray[row].array[i]
	}
	states[pLength]=arrayDist.header[col].split('=')[1]
	// Update data didtribution
	for(let i=0; i<node.data[index].distribution.length;i++){
		const dist = node.data[index].distribution[i]
		let match = true
		for(let j=0;j<dist.cond.length;j++){
			const cond = dist.cond[j]
			const index = variables.findIndex((item:any)=> item == cond.variable)
			if(index > -1){
				if(cond.states.name != states[index])
					match = false
			}
		}
		if(match){
			if(ev.target.name.includes('Mean'))
				dist.mean = Number(ev.target.value)
			if(ev.target.name.includes('Var'))
				dist.variance = Number(ev.target.value)
		}
	}
	node = node
	
}

const isNumber = (value:any)=>{
	return (typeof(value) === "number")
}

</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span style="margin-right:5px;">DISTRIBUTION DEF  {node.label}</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		<div class="dist-menu-toolbar">
			<input type="button" value="EXP" on:click={exp} />
			<input type="button" value="IMP" on:click={imp} />
		</div>
		<table style="width:100%">
			{#if node.data }
				{#if node.data[index].distribution}
						<tr>
							{#each getArrayFromDistribution(node,index).header as col,idx1}
								<th align='left'>{col}</th>
							 {/each}
						</tr>
					  {#each getArrayFromDistribution(node,index,'CONTINUOUS').distarray as row, index}
						  <tr>
							{#each row.array as col,i}
								{#if col.state}
									<td>{col.state}</td>
								{:else}
									<td><GaussParams  node={node} graph={graph} i={i} index={index} col={col} defDistPar={defDist} /></td>
								{/if}
							{/each}
						  </tr>
					  {/each}
				{/if}
			{/if}
		</table>
	</header>
</div>

<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 20px;
		left: 20px;
		min-width:250px;
		border-radius: 6px;
		box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
		border: solid 1px;
		z-index: 4;
		justify-content: space-between;
		align-items: left;
		background-color: var(
			--prop-minimap-background-color,
			var(
				--minimap-background-color,
				var(--background-color, var(--default-minimap-background-color))
			)
		);
		border-color: var(
			--prop-minimap-border-color,
			var(--minimap-border, var(--default-minimap-border))
		);
		font-family:Verdana, Geneva, Tahoma, sans-serif;
		font-size: normal;
	}

	.data-menu-header{
		display:flex;
		justify-content: space-between;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		background-color: var(--background-color);
	}

	table{
		font-size:small ;
	}
	th, td {
		padding: 3px;
	}
	
</style>