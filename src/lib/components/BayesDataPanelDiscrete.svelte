<script lang="ts">

export let node:any
export let index:any
export let i:any
export let delVar:any
export let Status:any

const defValue = (ev:any|undefined)=>{
	const div = document.getElementById('id-class-data-input-type')
	if(div){
			
			div.style.height='inherit'
			div.style.visibility='visible'
			const cevent = new CustomEvent("clickinput", 
			{
				bubbles: true,
				detail: { status: Status }
			}
		)
		
		div.dispatchEvent( cevent)
	}
	
		
}

 </script>

	<div class='list-item'>
		<label for="name">STATUS: </label>
		<input size="12" class="statustext" name="name-{i}" type="text" bind:value={Status.name}/>
		{#if node.data[index].type !='NONE'}
			<input  type="button" name="IDX-{index}" value=".." on:click={defValue}/>
		{/if}
		<label for="description">DESCRIPTION: </label>
		<input class="statustext" name="description-{i}" type="text" bind:value={Status.description} />
		<input  type="button" name="IDX-{i}" value="X" on:click={delVar}  />
	</div>

 <style>
	 .list-item{
		display:flex;
		justify-content: space-between;
		align-items:center ;
		margin: 2px 5px 2px 5px;
		width:550px;

	}

	label{
		font-size: x-small;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}
</style>