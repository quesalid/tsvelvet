<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, 
	getArrayFromDistribution, 
	getStatusDistribution,
	updateAllDValues,
	Mixture,
	getMeansVariancesWeight,
	normalizeProb,
	normalizeWeight,} from './GraphUtils'


export let id: string|any = 'defaultDistributionMenuContainer'
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
	 if(node.nodetype == 'CONTINUOUS'){
		 // A. NORMALIZE WEIGTHS
		normalizeWeight(node)
		 // GET MEAN,VARIANCE,WEIGTH ARRAY FROM DISTRIBUTION
		const mv = getMeansVariancesWeight(node,index)
		// B. UPDATE ContValue COMPONENT 
		const element = document.getElementById('NWC-'+node.id+'-'+node.label)
		if(element){
			const event = new CustomEvent('changevalue', {detail: {mv:mv}})
			element.dispatchEvent(event)
		}
	 }
	 // NORMALIZE PROBABILITIES
	normalizeProb(node)
	// UPDATE ALL DiscreteValue COMPONENTS
	updateAllDValues(document,graph)
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";

	 // UPDATE NODE PROBABILITY
	// B. For each state compute probability
	if(node.nodetype == 'CONTINUOUS'){
		for(let i=0;i<node.data[0].distribution.length;i++){
			const dist = node.data[0].distribution[i]
			const means = [dist.mean]
			const variances = [dist.variance]
			const weigths = [dist.weight]
			const mixture = new Mixture(means,variances,weigths);
			mixture.setLimits(-20,20)
			mixture.setNorm(node.data[0].distribution.length/node.data[0].status.length)
			// B. For each state compute probability
			const status = node.data[0].status.find((item:any)=>item.name == dist.cond[0].states.name)
			console.log("CALC PROB",status.value, dist.cond[0].states.name)
			let minmax = ['0','0']
			if(status.value && typeof(status.value) == 'string')
				minmax = status.value.split(',')
			const start = !isNaN(Number(minmax[0]))?Number(minmax[0]):0
			const end = !isNaN(Number(minmax[1]))?Number(minmax[1]):0
			const pstart = mixture.getProbability(start)
			const pend = mixture.getProbability(end)
			console.log("CALC PROB",pstart, pend)
			const p = pend - pstart
			dist.prob = p
		}
	}
}


let defDist = (ev:any|undefined)=>{
	index = node.data.findIndex((item:any)=>item.distribution)
	const arrayDist = getArrayFromDistribution(node,index)
	const dataset = ev.target.dataset
	const row = dataset.row
	const col = dataset.col
	// First column is the status
	const status = arrayDist.distarray[row].array[0]
	// Get variables and discard node variable status
	const variables = arrayDist.header.filter((item:any)=>(!item.includes('=')))
	const pLength = variables.length
	variables.push(node.label)
	const states = []
	for(let i=0; i<pLength;i++){
		states[i]=arrayDist.distarray[row].array[i]
	}
	states[pLength]=arrayDist.header[col].split('=')[1]
	// Update data didtribution if DISCRETE and weigths if CONTINUOUS
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
			if(node.nodetype == 'CONTINUOUS'){
				dist.weight = Number(ev.target.value)
			}else{
				dist.prob = Number(ev.target.value)
			}
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
					{#if node.nodetype == 'CONTINUOUS'}
					  {#each getArrayFromDistribution(node,index,'WEIGHT').distarray as row, index}
						  <tr>
							{#each row.array as col,i}
								{#if !isNumber(col)}
									<td>{col}</td>
								{:else}
									<td><input class="{node.nodetype}" size="6" type="text" name={'NW-'+node.id+'_'+i} data-col={i} data-row={index} value={col} on:change={defDist} /></td>
								{/if}
							{/each}
						  </tr>
					  {/each} 
					 {:else}
						{#each getArrayFromDistribution(node,index).distarray as row, index}
						  <tr>
							{#each row.array as col,i}
								{#if !isNumber(col)}
									<td>{col}</td>
								{:else}
									<td><input class="{node.nodetype}" size="6" type="text" name={'NW-'+node.id+'_'+i} data-col={i} data-row={index} value={col} on:change={defDist} /></td>
								{/if}
							{/each}
						  </tr>
					  {/each} 
					  {/if}
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

	/*.CONTINUOUS{ 
            pointer-events: none;
			background-color: #EDEDED;
     } */
	
</style>