<script lang="ts">
import {onMount} from "svelte"

export let node:any
export let inpuHeaderColor = '#f1f1f1'
export let inputStatus = {name:''}
export let index = 0


onMount(async()=>{
		let div  = document.getElementById('id-class-data-input-type')
		if(div){
			div.addEventListener('clickinput',evHandler)
		}
})

const evHandler = async(ev:any)=>{
        let status = ev.detail.status
        inputStatus = status
       
	}

const closeInputMenu = (ev:any)=>{
	let div  = document.getElementById('id-class-data-input-type')
	if(div){
		div.style.height= "10px";
		div.style.visibility = "hidden";
	}
}
</script>


		<div class="class-data-input-type" id="id-class-data-input-type">
			<div class="data-input-header" style="--background-color:{inpuHeaderColor}">
				<span>INPUT TYPE - {node.data?node.data[index].type:''} </span>
				<input type="button" value="CLOSE" on:click={closeInputMenu} />
			</div>
			<div class="data-input-body">
				<label for="status-value">STATE:</label>
				<input size="10" class="status-value" name="status-value" type="text" bind:value={inputStatus.name} disabled/>
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
}

.data-input-body label{ 
	font-size:small;
	margin-left: 3px;
	margin-right: 3px;
}
</style>