<script lang="ts">
	
	import {onMount} from "svelte"

	export let status: any
	export let value : any
	export let node: any
	
	onMount(()=>{
		const element = document.getElementById('NW-'+node.id+'-'+status.name)
		if(element){
			element.addEventListener('changevalue',evHandler)
		}
	})

	const evHandler = (ev:any)=>{

		value = ev.detail.value
		if(ev.detail.status)
			status.name =  ev.detail.status
		status = status
	}

	const getPercent = (value:any)=>{
		
		if(value!=undefined)
			return(value*100).toString()+"%"
		else
			return("0%")
	}

	
</script>

<div class="bayes-node-dicrete-value" id="{'NW-'+node.id+'-'+status.name}">
   
	<label for="meter-{status.name}">{status.name}</label>
	<meter id="meter-{status.name}" value="{value}">{getPercent(value)}</meter>
	<label class="spaced-label" for="meter-{status.name}">{getPercent(value)}</label>
	<input type="checkbox" id="check-{status.name}" name="check-{status.name}" value="60%">
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