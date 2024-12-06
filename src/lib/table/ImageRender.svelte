<script lang="ts">

export let image = "/BUDDY.png"
export let style  = "enabled;"
export let onClick:any = null
export let name = 'img-generic'
export let uid = ''
export let height = "25"
export let classname = "image-tool-component"

</script>
	<div class="image-tool-component-div">
		<input type="image" id="{name+'-'+uid}" data-uid={uid} style="{style}" class="image-tool-component {classname}" src="{image}" alt="ALT IMAGE" height="{height}" on:click={onClick?onClick:null}/>
	</div>
<style>


.image-tool-component-div {
	margin: 2px 2px 2px 2px;
	opacity: 0.8;
	text-align: center;
}



</style>