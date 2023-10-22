<script lang="ts">
import {onMount} from "svelte"
    import App from "../../App.svelte";

import DRangeSlider from './DRangeSlider.svelte'

export let node:any
export let inpuHeaderColor = '#f1f1f1'
export let inputStatus = {name:'',value:null}
export let index = 0

let start;
let end;
let scale = 20;
let shift = 0.5

onMount(async()=>{
		let div  = document.getElementById('id-class-data-input-type')
		if(div){
			div.addEventListener('clickinput',evHandler)
		}
})

const evHandler = async(ev:any)=>{
        let status = ev.detail.status
        inputStatus = status
		if( node.data && node.data[index].type =='INTERVAL'){
			if(inputStatus.value != undefined){
				const minmax = inputStatus.value.split(',')
				console.log("INTERVAL",minmax)
				start=(Number(minmax[0])/scale - shift +0.5) <=1?Number(minmax[0])/scale - shift +0.5:1
				end=(Number(minmax[1])/scale -shift+0.5) >=0?Number(minmax[1])/scale -shift+0.5:0
				console.log("INTERVAL",start,end)
			}else{
				start = 0
				end = 1
			}
		}
       
	}

const closeInputMenu = (ev:any)=>{
	let div  = document.getElementById('id-class-data-input-type')
	if(div){
		div.style.height= "10px";
		div.style.visibility = "hidden";
	}
}

const valueChecked = (ev:any)=>{
	let value = ev.target.checked
	inputStatus.value = value
}

const valueNumber = (ev:any)=>{
	let value = ev.target.value
	inputStatus.value = value
}
</script>


		<div class="class-data-input-type" id="id-class-data-input-type">
			<div class="data-input-header" style="--background-color:{inpuHeaderColor}">
				<span>INPUT TYPE - {node.data?node.data[index].type:''} </span>
				<input type="button" value="X" on:click={closeInputMenu} style="margin-right:4px;"/>
			</div>
			<div class="data-input-body">
				<label for="status-value">STATE:</label>
				<input size="10" class="status-value" name="status-value" type="text" bind:value={inputStatus.name} disabled/>
				<label for="status-value">VALUE:</label>
				<input size="10" class="status-value" name="status-value" type="text" bind:value={inputStatus.value} disabled/>
				<!-- ADD EDIT TOOL DEPENDING ON VARIABLE TYPE-->
				{#if node.data && node.data[index].type =='BOOL'}
					<input type="checkbox" id="check-boolean" on:change="{valueChecked}" name="check-boolean" checked={inputStatus.value}>
				{/if}
				{#if node.data && node.data[index].type =='INT'}
					<input type="number" id="value-number" on:change="{valueNumber}" name="value-number" value={inputStatus.value}>
				{/if}
				{#if node.data && node.data[index].type =='INTERVAL'}
					<DRangeSlider bind:start bind:end bind:value={inputStatus.value} scale={scale} shift={shift}/>
				{/if}
			</div>
		</div>

<style>
.class-data-input-type{
		display:block;
		justify-content: left;
		background-color: white;
		width: inherit;
		height: 10px;
		z-index: 5;
		border: solid 1px;
		visibility: hidden;
}

.data-input-header{
		display:flex;
		justify-content: space-between;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		background-color: var(--background-color);
	}
.data-input-body{
	display:flex;
	justify-content: left;
	margin-top: 5px;
	margin-bottom: 10px;
}

.data-input-body label{ 
	font-size:small;
	margin-left: 3px;
	margin-right: 3px;
}
.status-value{
	margin-right: 3px;
}
</style>