<script lang='ts'>
  import { onMount } from 'svelte'
  import Editor from '../svelteflow/Editor.svelte'
  import {AuxiliaryNode, FlowNode, StockNode} from '../svelteflow/nodes'

  let nodeTypesNames = ['flow','stock','auxiliary']
  let nodeTypes = {
	flow: FlowNode,
	stock: StockNode,
	auxiliary: AuxiliaryNode,
  }
  let maintop = "55px"
  let minimap = false
  let load = (ev:any) =>{
      console.log("LOAD GRAPH")
  }
  let save = (ev:any) =>{
      console.log("SAVE GRAPH")
  }

</script>


<div class="editor-container">
	<Editor 
		maintop={maintop} 
		nodeTypesNames={nodeTypesNames} 
		nodeTypes={nodeTypes} 
		load={load} 
		save={save} 
		minimap={minimap} 
		width="80vw" 
		height="60vh"/>
</div>

<style>
</style>
