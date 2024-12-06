<script lang="ts">


export let image = "/BUDDY.png"
export let style  = "enabled;"
export let onClick:any = null
export let name = 'img-generic'
export let uid = ''
export let height = "30"
export let classname = "image-tool-component"
export let getimage:any = null


</script>
	<div class="image-tool-component-div">
		<input type="image" id="{name+'-'+uid}" data-uid={uid} style="{style}" class="image-tool-component {classname}" src="{image}" alt="ALT IMAGE" height="{height}" on:click={onClick?onClick:null}/>
	</div>
<style>


.image-tool-component-div {
	margin: 2px 2px 2px 2px;
	opacity: 1.0;
	text-align: center;
	border: 1px solid #a0a0a0;
	border-radius: 50%;
}



</style>