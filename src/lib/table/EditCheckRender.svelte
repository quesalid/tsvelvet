<script lang="ts">

export let style  = "enabled;"
export let onClick = null
export let name = 'text-generic'
export let uid:any = ''
export let key = ''
export let value:any = ''
export let height = "25"
export let classname = "image-tool-component"

const onChange = (ev:any)=>{
	const value = (ev.target.checked?'true':'false')
	if(onClick)
		onClick(uid,key,value)
}

const setChecked = (val:any)=>{
	const value = (val == 'true'?true:false)
	return( value)
}

</script>

	<div class="image-tool-component-div">
		<input type="checkbox"  style="{style}" class="image-tool-component {classname}"  value="{value}" checked={setChecked(value)} on:click={onClick?onChange:null}/>
	</div>

<style>

.check-tool-component-div {
	margin: 2px 2px 2px 2px;
	text-align: center;
}


</style>