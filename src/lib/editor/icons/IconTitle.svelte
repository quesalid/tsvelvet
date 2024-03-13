<script lang='ts'>
import {graphStore} from '../graphstore'
export let uid = ''
export let bgcolor = '#FFFFFF'

const getTitle = ()=>{
	let rt = ''
	const found = $graphStore.nodes.find((item:any)=>item.id == uid)
	if(found){
		if(found.data && found.data.name)
			rt = found.data.name
		else
			rt = found.customnode
	}
	return(rt)
}
</script>
	<div class="icon-title-container" style="--bgcolor:{bgcolor};">
		{getTitle()}
	</div>
<style>
.icon-title-container{
	display:flex;
	justify-content:center;
	width:100%;
	border: 1px solid #999999;
	background-color: var(--bgcolor);
	font-size: 10px;
	text-align: center;
}
</style>