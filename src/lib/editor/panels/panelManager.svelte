<script lang="ts">
// EXTERN
import { onMount} from 'svelte';
// INTERNAL
import panelDefault from './panelDefault.svelte'



const comps = [
	{name:'panelDefault',comp:panelDefault}
]

let compname = 'panelDefault'
let uid:any = ''
let comp = comps[0]
onMount(async () => {
	const thisdiv = document.getElementById("panel-manager-id")
	if(thisdiv){
		thisdiv.addEventListener("iconeditclicked", (ev:any)=>{
			console.log("RECEIVED ICON CLICKED",ev.detail,thisdiv)
			const details = ev.detail
			uid = details.uid
			compname = details.compname
			const found = comps.find((item:any)=>item.name == compname)
			if(found)
				comp = found
			thisdiv.style['visibility']='visible'
			})
	}
})
const savePanelInfo = (ev:any) =>{
	console.log("SAVE PANEL INFO")
	const thisdiv = document.getElementById("panel-manager-id")
	if(thisdiv)
		thisdiv.style['visibility']='hidden'
}
const exitPanel = (ev:any) =>{
	console.log("EXIT PANEL")
	const thisdiv = document.getElementById("panel-manager-id")
	if(thisdiv)
		thisdiv.style['visibility']='hidden'
}

</script>

	<div id="panel-manager-id">
		<svelte:component this={comp.comp} uid={uid}/>
		<div id="panel-manager-footer-id">
			<input type='button' value="SAVE" on:click={savePanelInfo}/>
			<input type='button' value="EXIT" on:click={exitPanel}/>
		</div>
	</div>

<style>
#panel-manager-id{
	display:block;
	visibility:hidden;
	position:fixed;
	top: 300px;
	left:10px;
	width:fit-content;
	z-index: 10;
	border: solid 1px;
}
#panel-manager-footer-id{
	display:flex;
	justify-content: right;
	margin: 2px;
}
input[type='button']{
	cursor:pointer;
	border: 1px solid;
	margin-right: 2px;
}
</style>