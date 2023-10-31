<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import BayesDataPanelDiscrete from "./BayesDataPanelDiscrete.svelte";
import BayesInputVariable from "./BayesInputVariable.svelte";


import {dragElement, 
		setGraphInitialDistribution,
		getStatusDistribution,
		adjustNodeHeight,
		STATETYPE} from './GraphUtils'


export let id: string|any = 'defaultDataMenuContainer'
export let node: any 

export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("IMPORT DATA")
export let graph = {nodes:[],edges:[]}



//export let panel = []


let newkey = ''
let newtype='text'
let newvalue= ''
let index = 0
let keys = []
let inpuHeaderColor = '#f1f1f1'
let inputStatus = {name:''}


const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}


onMount(async () => {  
	const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);
	keys = Object.keys(STATETYPE)
	dragElement(dragable, dragzone);
 })

const closeMenu = (ev:any)=>{
	setGraphInitialDistribution(graph)
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
	 let div  = document.getElementById('id-class-data-input-type')
	if(div){
		div.style.height= "10px";
		div.style.visibility = "hidden";
	}
	 setGraphInitialDistribution(graph)
	 updateDiscreteValues()
}


let defVar = (ev:any|undefined)=>{
	// ADD NEW STATUS TO NODE
	index = node.data.findIndex((item:any)=>item.status)
	if(index >-1){
		// generate unique inital name for status
		let name = 'STATUS'
		let i = 0
		while(node.data[index].status.findIndex((item:any)=>item.name==name+i)>-1){
			i++
		}
		name = name+i
		const status = {name:name,description:'',value:null}
		node.data[index].status.push(status)
		if(status.name.length >0)
			setGraphInitialDistribution(graph)
	}
	node = node

}

let delVar = (ev:any|undefined)=>{
	// DELETE STATUS FROM NODE
	const id = ev.target.name
	const idx = id.split('-')[1]
	node.data[index].status.splice(idx,1)
	index = node.data.findIndex((item:any)=>item.status)
	// RE-INITIALIZE DISTRIBUTION
	setGraphInitialDistribution(graph)
	node = node
}


let updateDiscreteValues = async ()=>{
	// UPDATE DiscreteValue COMPONENTS
	const states = node.data[index].status
	for(let i=0;i<states.length;i++){
		const status = states[i]
		const valueEvent = new CustomEvent("changevalue", { detail: {status:status.name,value:getStatusDistribution(graph,node,status.name)} });
		const element = document.getElementById('NW-'+node.id+'-'+status.name)
		if(element){
			element.dispatchEvent(valueEvent)
		}
		await sleep(50)
	}
	adjustNodeHeight(graph,document)
}

const changeVal = (ev:any) => {
	node.data[index].type = ev.target.value
}


const getInputStatus = ()=>{
	let div  = document.getElementById('id-class-data-input-type')
	if(div)
		console.log("INPUT STATUS",div.dataset.status)
	return div?div.dataset.status:''
}

</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span>STATES DEFINITION - {node.label}</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		 <div class="data-menu-toolbar">
			<input type="button" value="+" on:click={defVar} />
			<input type="button" value="EXP" on:click={exp} />
			<input type="button" value="IMP" on:click={imp} />
			<div>
			{#if node.data && index != -1 && node.data[index].type}
				<label class="tooltip" for="nodetype-select">TYPE: 
					<span class="tooltiptext">State value type</span>
				</label>
				<select name="nodetype" id="nodetype-select" on:change={changeVal} disabled={node.nodetype=="CONTINUOUS"?true:false}>
					{#each keys as key,i}
						{#if node.data[index].type == STATETYPE[key]}
							<option value={STATETYPE[key]} selected>{STATETYPE[key]}</option>
						{:else}
							<option value={STATETYPE[key]}>{STATETYPE[key]}</option>
						{/if}
					{/each}
				</select>
			{/if}
			</div>
		</div>
		<div class="data-menu-body">
			<!--div class='list-item-add' id="list-item-add-id">
				
			</!--div-->
			{#if node.data && index != -1}
				{#each node.data[index].status as Status, i}
					<BayesDataPanelDiscrete node={node} i={i} Status={Status} index={index} delVar={delVar}/>
				{/each}	
			{/if}
		</div>
			<BayesInputVariable node={node} index={index} bind:inputStatus={inputStatus} inpuHeaderColor={inpuHeaderColor}/>
	</header>
</div>


<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 20px;
		left: 20px;
		width:max-content;
		overflow-y: auto;
		border-radius: 6px;
		overflow: hidden;
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

	.data-menu-header input {
		cursor: pointer;
	}
	.data-menu-toolbar{
		display:flex;
		justify-content: left;
		margin-top: 4px;
		margin-bottom: 12px;
		margin-left: 2px;
	}

	.data-menu-toolbar input {
		cursor: pointer;
	}
	.data-menu-toolbar input{
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
	}
	.data-menu-body{
		display:block;
		justify-content: left;
		overflow-y: auto;
		overflow-x:hidden;
		/*height: 250px;*/
		width: 100%;
	}

	label{
		font-size: x-small;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}

	.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}


	
</style>