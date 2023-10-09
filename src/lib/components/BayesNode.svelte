<script lang="ts">
    
import {onMount} from "svelte"
    import App from "../../App.svelte";
    import BayesDataPanel from "./BayesDataPanel.svelte";
import DiscreteValue from "./DiscreteValue.svelte";
import {getStatusDistribution} from './GraphUtils.js'

export let node: any
export let graph: any = {nodes:[],edges:[]}
export let deleteNodeClicked = (ev:any)=>{console.log("DELETENODE CLICKED")}
export let dataNodeClicked = (ev:any)=>{console.log("DATANODE CLICKED")}
export let distNodeClicked = (ev:any)=>{console.log("DISTNODE CLICKED")}

let index = 0
let value = [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8]



onMount(()=>{
	const states = node.data[index].status
	value = Array(states.length)
	for(let i=0;i<states.length;i++){
		value[i] = getStatusDistribution(graph,node,states[i].name)
		const status = states[i]
		const valueEvent = new CustomEvent("changevalue", { detail: {value:getStatusDistribution(graph,node,status.name)} });
		const element = document.getElementById('NW-'+node.id+'-'+status.name)
		if(element){
			element.dispatchEvent(valueEvent)
		}
	}
})

</script>

	<div class="bayes-node-wrapper-p" id="{'NW-'+node.id}" >
		<div class="node-menu-p" style="--background-color:{node.bgColor};">
			<input type="button" value="VAR" data-node="{'N-'+node.id}" on:click={dataNodeClicked}/>
			<input type="button" value="DIST" data-node="{'N-'+node.id}" on:click={distNodeClicked}/>
			<input type="button" value="DELETE" data-node="{'N-'+node.id}" on:click={deleteNodeClicked}/>
		</div>
		<div class="node-body-p">
			<div class="bayes-node-label">{node.label}</div>
			<div>{node.nodetype}</div>
			{#if node.data && index != -1}
				<div class="dscrete-container">
				{#each node.data[index].status as Status, i}
					<DiscreteValue graph={graph} bind:node={node} bind:status={Status} bind:value={value[i]}/>
				{/each}	
				</div>
			{/if}
		</div>
	</div>

<style>

/*.node-wrapper{
	display:block;
	top: 0;
}*/
.bayes-node-wrapper-p{
  box-sizing: border-box;
  width:100%;
  height:fit-content;
  border-radius: 8px;
  position: absolute;
  top:0;
  left:0;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  padding: 1px;
  gap: 10px;
  border: 1px solid;
  background-color: white;
}
.node-menu-p{
	display:flex;
	justify-content: right;
	background-color: var(--background-color);
}

.node-menu-p input{
	margin-right: 2px;
	cursor: pointer;
}

.node-body-p{
	display:block;
	justify-content: left;
	background-color: white
}

.node-body-p div{
	margin-left: 5px;
}

.bayes-node-label{
	font-weight: bold ;
}
.dscrete-container{
	display: block; 
}



</style>