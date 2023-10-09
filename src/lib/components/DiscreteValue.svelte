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
		//console.log("EVHANDLER",element,ev.detail.value, status, node.label)
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

<div class="bayes-node-dicrete-value" id="{'NW-'+node.id+'-'+status.name}" data-node={node.label}>
   
	<label for="meter-{status.name}">{status.name}</label>
	<meter id="meter-{status.name}" value="{value}">{getPercent(value)}</meter>
	<label class="spaced-label" for="meter-{status.name}">{getPercent(value)}</label>
	<input type="checkbox" id="check-{status.name}" on:change="{statusChecked}" name="check-{status.name}" value="60%">
</div>

<style>
.bayes-node-dicrete-value{
	display:grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	margin-top: 3px;
}
.spaced-label{
	margin-left: 10px;
}

label {
	font-family:Verdana, Geneva, Tahoma, sans-serif;
	font-size: smaller;
}
</style>