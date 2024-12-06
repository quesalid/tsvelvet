<script lang="ts">
  import { useEdges,useNodes } from '@xyflow/svelte';
  // import uuid
  import { v4 as uuidv4 } from 'uuid';
  //import { useDnD,useNodes,useEdges, getNodeColor } from './utils';
  import { useDnD, getNodeColor, getNodeLabel } from './utils';
  import './flowstyles.css'

  // EXPORT VARIABLE
  export let nodePanelId = 'NodePanelId'
  export let nodeTypesNames = ['mainEntity','areaEntity','localEntity','controlledEntity','controller']
 

  //const type = useDnD();
  const dndobject:any = useDnD()
  const nodes:any = useNodes();
  const edges:any = useEdges();

  const onDragStart = (event: DragEvent, nodeType: string, nodeColor:string|null) => {
    if (!event.dataTransfer) {
      return null;
    }
    const dob = {type:nodeType,color:nodeColor}
    //type.set(nodeType);
    dndobject.set(dob)

    event.dataTransfer.effectAllowed = 'move';
  };
  // Export json file
  const exp = (ev:any) => {
    // traverse nodes and add uid to internal data if not present
    $nodes.forEach((node:any) => {
	  if (!node.data.internalData.uid) {
		node.data.internalData.uid = uuidv4();
	  }
	});
    // add parent uid to internal data
      addParentUidToData($nodes, $edges, 'areaEntity', 'plant');
      addParentUidToData($nodes, $edges, 'localEntity', 'department')
      addParentUidToData($nodes, $edges, 'controlledEntity', 'line')
      addParentUidToData($nodes, $edges, 'controller', 'machine')

	const data = {nodes: $nodes, edges: $edges};
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'flow.json';
    a.click();

  }
  // Import json file
  const imp = (ev:any) => {
    
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.onchange = (e) => {
	  const file = (e.target as HTMLInputElement).files?.[0];
	  if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
          // clear current graph before import
          const nodePanel = document.getElementById(nodePanelId)
          const hideClicked = new CustomEvent("hidenodepanel", { detail: '' })
          nodePanel?.dispatchEvent(hideClicked)
		  const data = JSON.parse(e.target?.result as string);
		  $nodes = data.nodes;
		  $edges = data.edges;
		};
		reader.readAsText(file);
	  }
	};
	input.click();
  }
  // Clear Graph
  const clear = (ev:any) =>{
      $nodes = []
      $edges = []
      // send event to clear node panel
      const nodePanel = document.getElementById(nodePanelId)
      const hideClicked = new CustomEvent("hidenodepanel", { detail: '' })
      nodePanel?.dispatchEvent(hideClicked)
  }
  // Load graph from db
  export let load = (ev:any) =>{
      console.log("LOAD GRAPH")
  }
  // Save graph to db
  export let save = (ev:any) =>{
      console.log("SAVE GRAPH")
  }
  // UTILITIES
  const addParentUidToData = (nodes:any, edges:any, type:any, field:any) => {
	// for each node of type type, find its parent and add the parent's uid to its internal data at field field
    nodes.forEach((node:any) => {
	  if (node.type === type) {
          const parentEdge = edges.find((edge:any) => edge.target === node.id);
          if (parentEdge) {
			const parentNode = nodes.find((n:any) => n.id === parentEdge.source);
			if (parentNode) {
			  node.data.internalData[field] = parentNode.data.internalData.uid;
			}
		  }
      }
    });
  }

 export let menuitems = [
       {name:'Import',function:imp},
       {name:'Export',function:exp},
       {name:'Load',function:load},
       {name:'Save',function:save},
       {name:'Clear',function:clear}
   ]
</script>

<aside>
  <div class="aside-label">MENU.</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  {#each menuitems as item}
	<div class="aside-menuaction" on:click={item.function}>{item.name}</div>
  {/each}
  <div class="aside-nodes-container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#each nodeTypesNames as nodeType}
	  <div style="background-color: {getNodeColor(nodeType)} ;"
		class="custom-entity-node aside-node"
		on:dragstart={(event) => onDragStart(event, nodeType,getNodeColor(nodeType))}
		draggable={true}>
		{getNodeLabel(nodeType)}
	  </div>
	{/each}
  </div>
</aside>

<style>
  
</style>
