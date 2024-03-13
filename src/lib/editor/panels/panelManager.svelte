<script lang="ts">
// EXTERN
import { onMount} from 'svelte';
// INTERNAL
import panelDefault from './panelDefault.svelte'
import {selected,selectNode} from '../graphstore.js'



const comps = [
	{name:'panelDefault',comp:panelDefault}
]
const PANELMANAGER = 'panel-manager-id'

let compname = 'panelDefault'
let uid:any = ''
let comp = comps[0]
onMount(async () => {
	const thisdiv = document.getElementById(PANELMANAGER)
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
	const thisdiv = document.getElementById(PANELMANAGER)
	if(thisdiv){
		thisdiv.style['visibility']='hidden'
		selectNode($selected,false)
		$selected=''
	}
}
const exitPanel = (ev:any) =>{
	console.log("EXIT PANEL")
	const thisdiv = document.getElementById(PANELMANAGER)
	if(thisdiv){
		thisdiv.style['visibility']='hidden'
		selectNode($selected,false)
		$selected=''
	}
}

</script>

	<div id="{PANELMANAGER}">
		<div id="panel-manager-header-id">
			<input type='button' value="SAVE" on:click={savePanelInfo}/>
			<input type='button' value="EXIT" on:click={exitPanel}/>
		</div>
		<svelte:component this={comp.comp} uid={uid}/>
	</div>

<style>
#panel-manager-id{
	display:block;
	visibility:hidden;
	position:fixed;
	top: 10px;
	left:80%;
	width:20%;
	z-index: 10;
	border: solid 1px;
	border-radius: 6px;
	margin-right: 3px;
}
#panel-manager-header-id{
	display:flex;
	justify-content: right;
	margin: 2px;
	text-decoration: none;
	font-size: 13px;
}
input[type='button']{
	background-color: #eeeeee;
	cursor:pointer;
	border: 1px solid #aaaaaa;
	padding-bottom: 2px ;
	margin-right: 1px;
	padding: 1px;
}
input[type='button']:hover{
	font-weight: bold ;
}
</style>