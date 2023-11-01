<script lang="ts">
    
import {onMount} from "svelte"
import DiscreteValue from "./DiscreteValue.svelte";
import ContValue from "./ContValue.svelte";
import {getStatusDistribution} from './GraphUtils.js'

export let node: any
export let graph: any = {nodes:[],edges:[]}
export let deleteNodeClicked = (ev:any)=>{console.log("DELETENODE CLICKED")}
export let dataNodeClicked = (ev:any)=>{console.log("DATANODE CLICKED")}
export let distNodeClicked = (ev:any)=>{console.log("DISTNODE CLICKED")}
export let distDefClicked = (ev:any)=>{console.log("DISTDEF CLICKED")}


let index = 0



onMount(()=>{
	
})

const getVal = (i:any)=>{
	const states = node.data[index].status
	const value =  getStatusDistribution(graph,node,states[i].name)
	return value
}



	

</script>

	<div class="bayes-node-wrapper-p" id="{'NW-'+node.id}" 
	 >
		<div class="node-menu-p" style="--background-color:{node.bgColor};">
			<div style="text-align: center ;">
				<input id="label" size="5" class="node-datacomp" value="{node.graphtype}" type="text" min="0" style="text-align: left;" disabled/>
			</div>
			<input type="button" value="VAR" data-node="{'N-'+node.id}" on:click={dataNodeClicked}/>
			<input type="button" value="DIST" data-node="{'N-'+node.id}" on:click={distNodeClicked}/>
			<input type="button" value="X" data-node="{'N-'+node.id}" on:click={deleteNodeClicked}/>
		</div>
		<div class="node-body-p">
			<div class="bayes-node-label">{node.label}</div>
			<div style="display:flex;justify-content:last baseline;align-items: center;">
				<span>{node.nodetype}</span>
				{#if node.nodetype == "CONTINUOUS"}
					<ContValue graph={graph} bind:node={node} distDefClicked={distDefClicked}/>
				{/if}
			</div>
			<div class="divider"></div>
			{#if node.data && index != -1}
				<div class="dscrete-container">
				{#each node.data[index].status as Status, i}
					<DiscreteValue graph={graph} bind:node={node} bind:status={Status} value={getVal(i)}/>
				{/each}	
				</div>
			{/if}
		</div>
		<!--div class="node-body-p">
			<input id="label" size="5" class="input-footer" value="x:{node.position.x}" type="text" min="0" />
			<input id="label" size="5" class="input-footer" value="y:{node.position.y}" type="text" min="0" />
		</!--div-->
	</div>

<style>


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
  border: 3px solid;
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
	background-color: white;
	padding-bottom: 2px;
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
.node-datacomp{
		-webkit-border-radius: 30px;
		-moz-border-radius: 30px;
		 border-radius: 30px;
		 border: 1px solid #2d9fd9;
		 background-color: #FFFFFF;
		 color: #777777;
		 padding-left: 10px;
		 text-align: center;
		 cursor:pointer;
	}
.divider {
  border-bottom: 1px solid black;
  margin: 5px
}
</style>