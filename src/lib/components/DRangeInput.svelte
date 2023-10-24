<script lang="ts">

export let start = 0;
export let end = 20;
export let value:any

const changeValue = (ev:any)=>{
	const id = ev.target.id
	if(id == 'value-number-min'){
		start = ev.target.value
	}else{
		end = ev.target.value
	}
	if(start > end){
		start = end
	}
	value = `${start},${end}`
}

</script>

<div class="double-range-container">
	<input size="10" max={end} type="number" id="value-number-min" on:input={changeValue} on:change="{changeValue}" name="value-number" value={start}>
	<input size="10" min={start} type="number" id="value-number-max" on:input={changeValue} on:change="{changeValue}" name="value-number" value={end}>
</div>

<style>
	.double-range-container {
		display:flex;
		justify-content: space-between;
	}
	
</style>
