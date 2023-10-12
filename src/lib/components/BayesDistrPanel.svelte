<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, getArrayFromDistribution, getStatusDistribution,updateAllDValues} from './GraphUtils'


export let id: string|any = 'defaultDistributionMenuContainer'
export let node: any ={data:[]}

export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("IMPORT DATA")
export let graph = {nodes:[],edges:[]}



//export let panel = []


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
}


let defDist = (ev:any|undefined)=>{
	index = node.data.findIndex((item:any)=>item.distribution)
	const arrayDist = getArrayFromDistribution(node,index)
	console.log("ARRAY DIST",arrayDist)
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
			//console.log("INDEX",index,cond.states.name,variables)
			if(index > -1){
				if(cond.states.name != states[index])
					match = false
			}
		}
		if(match)
			dist.prob = Number(ev.target.value)
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
			<span style="margin-right:5px;">DISTRIBUTION  {node.label}</span>
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
					  {#each getArrayFromDistribution(node,index).distarray as row, index}
						  <tr>
							{#each row.array as col,i}
								{#if !isNumber(col)}
									<td>{col}</td>
								{:else}
									<td><input size="6" type="text" name={'NW-'+node.id+'_'+i} data-col={i} data-row={index} value={col} on:change={defDist} /></td>
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
		/*overflow-y: auto;
		overflow-x: auto;
		overflow: hidden;*/
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