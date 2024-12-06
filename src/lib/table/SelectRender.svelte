<script lang="ts">
import { onMount} from "svelte";

export let style:any  = "enabled;"
export let onClick:any = null
export let name = 'img-generic'
export let options:any = []
export let classname = "check-tool-component"
export let type = ''
export let uid = ''

onMount(async () => { 
	//console.log("SELECT RENDER",options)
	
  })
</script>

	<div class="image-tool-component-div">
		<select class="wmanag-select"  on:change={onClick}>
					<option value="" style="color:#afafaf"></option>
					{#each options as Opt}
						<option value={Opt} selected={Opt==type?true:false}>{Opt}</option>
					{/each}
		</select>
	</div>

<style>

.check-tool-component-div {
	margin: 2px 2px 2px 2px;
	text-align: center;
}


</style>