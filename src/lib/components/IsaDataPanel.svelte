<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff
// https://www.w3schools.com/colors/colors_converter.asp

import { onMount} from "svelte";

import {dragElement} from './GraphUtils'
import IpInput from './IpInput.svelte'

export let id: string|any = 'defaultDataMenuContainer'
export let node: any 
export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("INPORT DATA")
export let filterKey = []
export let panel = []
export let graph = {nodes:[],edges:[]}



let newkey = ''
let newtype='text'
let newvalue= ''
let newsubtype=''
let newoptions = []
let ipArray = ['','','','']
let ipAddress = ''


onMount(async () => {  
     
	const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);

	if(dragable){
			dragable.addEventListener('checknodedata',evHandler)
	}

	newkey = 'name'
	dragElement(dragable, dragzone);
	console.log("PANEL",panel)
 })

 const evHandler = async(ev:any)=>{
		const dataupdate = []
		for(let i=0;i<filterKey.length;i++){
			const found = node.data.find((item:any)=> item.key == filterKey[i])
			dataupdate.push(found)
		}
		const panelfilter = panel.filter((item:any)=> item.option == node.nodetype)
		const intersection = node.data.filter(o => panelfilter.some(({name}) => o.key === name));
		for(let i=0;i<intersection.length;i++){
			dataupdate.push(intersection[i])
		}
		console.log("EVHANDLER",node.data,dataupdate)
		const index = graph.nodes.findIndex((item:any)=> item.id == node.id)
		if(index >-1){
			graph.nodes[index].data = dataupdate
			node.data = dataupdate
			graph = graph
			console.log("EVHANDLER",graph.nodes[index].data)
		}
		
	}

const closeMenu = (ev:any)=>{
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";

}

const changeVal = (ev:any)=>{
		const target = ev.target
		newvalue = target.value
}

const changeKey = (ev:any)=>{ 
		const target = ev.target
		newkey = target.value
		const item = panel.find((item:any)=> item.name == newkey)
		if(item){
			newtype = item.type
			newsubtype = item.subtype
			newoptions = item.options
		}
}

const changeValData = (ev:any)=>{
		const target = ev.target
		const key = target.id
		const value = target.value
		const index = node.data.findIndex((item:any)=> item.key == key)
		if(index > -1)
			node.data[index].value = value
}

const addToNode =  (ev:any)=>{
	    
	    if(validateKey(newkey.trim())){
			const newitem = {type:newtype, key:newkey, subtype:newsubtype,value:newvalue, options:newoptions}
			node.data.push(newitem)
			node = node
		}
		newkey = ''
		//newtype='text'
		newvalue = ''
		newsubtype=''
}

const deleteFromNode = (ev:any)=>{
	const target = event.target
	const key = target.id
	if(key){
		const filter = node.data.filter((item:any)=> item.key != key)
		node.data = filter
	}
}

const validateKey = (key:string)=>{
	if(key == '')
		return false
	const found = node.data.find((item:any)=> item.key == key)
	if(found)
		return false
	return true
}

let filterData = (key:any)=>{
	return !filterKey.includes(key)
}

const updateIp = (ev:any)=>{
	//check if valid triple
	const num = parseInt(ev.target.value)
	if(isNaN(num) || num < 0 || num > 255){
		ev.target.value = ''
		return
	}
	ipArray[ev.target.id] = ev.target.value.trim()
	ipAddress = ipArray.join('.')
	ipArray = ipArray
	console.log("UPDATE IP",ipAddress)
	const key = ev.target.name
	const index = node.data.findIndex((item:any)=> item.key == key)
	if(index > -1)
			node.data[index].value = ipAddress
}

</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span>DATA MENU {node.label}</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		 <div class="data-menu-toolbar">
			<input type="button" value="EXPORT" on:click={exp} />
			<input type="button" value="IMPORT" on:click={imp} />
		</div>
		<div class="data-menu-body">
			<div class='list-item-add' id="list-item-add-id">
				<!-- USE PREDEFINED KEYS IN PANEL COMPONENT-->
				<select name="nodekey" id="nodekey" on:change={changeKey}>
					{#each panel.filter((item)=> item.option == node.nodetype) as Option}
						<option value={Option.name}>{Option.name}</option>
					{/each}
				</select>
				<!--input type="{newtype}" value={newvalue} placeholder="Insert value..." on:change={changeVal}/-->
				<input type="button" value="ADD" on:click={addToNode}/>
			</div>
			{#if node.data}
				
					<div class='list-item'>
						<div class="labels1">
							{#each node.data as Item}
								{#if filterData(Item.key)}
									<label for="{'IN'+Item.key}">{Item.key}: </label>
								{/if}
							{/each}
						</div>
						<div class="inputs1">
							{#each node.data as Item}
								{#if filterData(Item.key)}
									<!-- INSERT INPUT TYPES-->
									{#if Item.subtype == 'ip'}
										<IpInput key={Item.key} bind:ipArray={ipArray} updateIp={updateIp}/>
									{:else if Item.subtype == 'select'}
										<select name="{'IN'+Item.key}" id="{Item.key}" value={Item.value} style=" margin: 10px 0 0;" on:change={changeValData}>
											{#each Item.options as Option}
												<option value={Option.name}>{Option.name}</option>
											{/each}
										</select>
									{:else if Item.subtype == 'textarea'}
										<textarea name="{'IN'+Item.key}" id="{Item.key}" value={Item.value} style=" margin: 10px 0 0;" on:change={changeValData}></textarea>
									{:else}
										<input min="0" max="65535" name="{'IN'+Item.key}" id="{Item.key}" type="{Item.type}" value={Item.value} style=" margin: 10px 0 0;" on:change={changeValData}/>
									{/if}
								{/if}
							{/each}
						</div>
						<div class="inputs2">
							{#each node.data as Item}
								{#if filterData(Item.key)}
									<input type="button" id={Item.key} value="X" on:click={deleteFromNode} style=" margin: 11px 0 0;" />
								{/if}
							{/each}
						</div>
					</div>
				
			{/if}
		</div>
	</header>
</div>

<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 20px;
		left: 20px;
		width:max-content;
		overflow-y: auto;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
		border: solid 1px;
		z-index: 4;
		justify-content: space-between;
		align-items: left;
		background-color: var(
			--prop-minimap-background-color,
			var(
				--minimap-background-color,
				var(--background-color, var(--default-minimap-background-color))
			)
		);
		border-color: var(
			--prop-minimap-border-color,
			var(--minimap-border, var(--default-minimap-border))
		);
		font-family:Verdana, Geneva, Tahoma, sans-serif;
		font-size: normal;
	}

	.data-menu-header{
		display:flex;
		justify-content: space-between;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		background-color: var(--background-color);
	}

	.data-menu-header input {
		cursor: pointer;
	}
	.data-menu-toolbar{
		display:flex;
		justify-content: left;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
	}

	.data-menu-toolbar input {
		cursor: pointer;
	}
	.data-menu-toolbar input{
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
	}
	.data-menu-body{
		display:block;
		justify-content: left;
		overflow-y: auto;
		overflow-x:hidden;
		/*height: 250px;*/
		width: 100%;
	}
	.list-item{
		display:block;
		width:400px;
		margin: 10px 3px 10px 3px;
	}
	.list-item-add{
		width:550px;
		margin: 10px 3px 10px 3px;
	}

	.labels1 {
		float: left;
		width: 120px;
	}
	.inputs1 {
		float: left;
		width: 220px;
	}
	.labels1 label{
		display: block;
		padding: 10px 0 0;
	}
	.inputs2 {
    float: left;
    width: 30px;
}

</style>