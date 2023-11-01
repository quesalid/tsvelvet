<script lang="ts">
	
	import {onMount} from "svelte"
	import {updateAllDValues,getAllCheckedStatus} from './GraphUtils'

	export let status: any
	export let value : any
	export let node: any
	export let graph: any = {nodes:[],edges:[]}

	
	onMount(()=>{
		const element = document.getElementById('NW-'+node.id+'-'+status.name)
		if(element){
			element.addEventListener('changevalue',evHandler)
		}
	})

	const evHandler = async(ev:any)=>{

		value = ev.detail.value
		if(ev.detail.status)
			status.name =  ev.detail.status
		status = status
		const element = 'NW-'+node.id+'-'+status.name
	}

	const getPercent = (value:any)=>{
		
		if(value!=undefined)
			return(Number(value).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}))
		else
			return("0%")
	}

	const statusChecked = (ev:any)=>{
		const element = ev.target
		const name = node.label
		// GET GIVEN STATUS
		const given = getAllCheckedStatus(document)
		if(ev.target.checked){
			// ADD ALL CHECKED STATUS
			given[name] = status.name
		}
		// UPDATE ALL DiscreteValue COMPONENTS
		updateAllDValues(document,graph,given)
	}
</script>

<div class="bayes-node-discrete-value" id="{'NW-'+node.id+'-'+status.name}" data-node={node.label}>
   
	<label class="tooltip" for="meter-{status.name}">{status.name}
		<span class="tooltiptext">{status.description}</span>
	</label>
	<meter id="meter-{status.name}" value="{!isNaN(value)?value:0.5}">{getPercent(value)}</meter>
	<label class="spaced-label" for="meter-{status.name}">{getPercent(value)}</label>
	<input type="checkbox" id="check-{status.name}" on:change="{statusChecked}" name="check-{status.name}" value="60%">
</div>

<style>
.bayes-node-discrete-value{
	display:grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	margin-top: 2px;
	margin-bottom: 2px;
}
.spaced-label{
	margin-left: 10px;
}

label {
	font-family:Verdana, Geneva, Tahoma, sans-serif;
	font-size: smaller;
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