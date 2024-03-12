<script lang='ts'>
import {graphStore,selectNode,selected} from '../graphstore'
export let menuwidth = '18px'
export let uid = ''
export let bgcolor = '#FFFFFF'

export const editClick = (ev:any) =>{
	console.log("EDIT CLICKED",uid,ev,$graphStore.nodes)
	const found = $graphStore.nodes.find((item:any)=>item.id == uid)
	if(found){
		// A. SELECT NODE 
		const divid = 'div-'+found.customnode+found.id 
		selectNode($selected,false)
		selectNode(divid,true)
		$selected = divid
		// B. OPEN EDIT PAN WITH NODE PARAMS (uid + customnode)
		const divPanelManager = document.getElementById('panel-manager-id')
		const showPanel = new CustomEvent("iconeditclicked", { detail: {uid:found.id,compname:'panelDefault'} })
		divPanelManager?.dispatchEvent(showPanel)
	}
}
export const deleteClick = (ev:any) =>{
	const id = ev.target.id.split("_")[1]

	// DELETE NODE FROM GRAPH STORE
	$graphStore.nodes = $graphStore.nodes.filter((item:any)=>item.id != id)
	// DELETE ANCHORS
	for(let i=0;i< $graphStore.nodes.length;i++){
		const node = $graphStore.nodes[i]
		for(let j=0;j< node.anchors.length;j++){
			$graphStore.nodes[i].anchors[j].connections = node.anchors[j].connections.filter((item:any)=>!item.includes(id))
		}
	}
	
	// FORCE GRAPH REDRAW
	const graphDropZone = document.getElementById('drop-zone-id')
    const redrawGraph = new CustomEvent("redrawgraph", { detail: id })
    graphDropZone?.dispatchEvent(redrawGraph)
	console.log("AFTER DELETE CLICKED",id,$graphStore.nodes)
}
</script>
	<div class="icon-menu-container" style="--bgcolor:{bgcolor};">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="icon-menu-item" on:click={editClick}>
			<svg id={"editsvg_"+uid} xmlns="http://www.w3.org/2000/svg"  width="{menuwidth}" height="{menuwidth}" viewBox="0 0 24 24"><path id={"editpath_"+uid} fill="currentColor" d="M5 19h1.098L16.796 8.302l-1.098-1.098L5 17.902zm-1 1v-2.52L17.18 4.288q.154-.137.34-.212q.186-.075.387-.075q.202 0 .39.063q.19.064.35.23l1.066 1.072q.166.16.226.35q.061.191.061.382q0 .203-.069.389q-.068.185-.218.339L6.52 20zM19.02 6.092l-1.112-1.111zm-2.783 1.67l-.539-.558l1.098 1.098z"/></svg>
		</div>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="icon-menu-item" on:click={deleteClick}>		
			<svg id={"editsvg_"+uid} xmlns="http://www.w3.org/2000/svg"  width="{menuwidth}" height="{menuwidth}" viewBox="0 0 24 24"><path id={"deletepath_"+uid} fill="currentColor" d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152q-.463.463-1.153.463zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192q.192-.193.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"/></svg>	
		</div>
	</div>
<style>
.icon-menu-container{
	display:flex;
	justify-content: right;
	width:100%;
	border: 1px solid #999999;
	background-color: var(--bgcolor);
}
.icon-menu-item{
	cursor:pointer;
}
</style>