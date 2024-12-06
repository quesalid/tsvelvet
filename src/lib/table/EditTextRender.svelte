<script lang="ts">

export let image = "/BUDDY.png"
export let style  = "enabled;"
export let onClick:any = null
export let name = 'text-generic'
export let uid:any = ''
export let key = ''
export let value:any = ''
export let height = "25"
export let classname = "image-tool-component"

const onChange = (ev:any)=>{
	if(onClick)
		onClick(uid,key,ev.target.value)
}

</script>
	<div class="text-tool-component-div">
		<input type="text"  style="{style}" class="text-tool-component {classname}" value="{value}" on:change={onClick?onChange:null}/>
	</div>
<style>


.text-tool-component-div {
	margin: 2px 2px 2px 2px;
	opacity: 0.8;
	text-align: center;
}


</style>