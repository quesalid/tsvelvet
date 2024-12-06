<script lang="ts">
  // EXTERNAL
  import { onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    useSvelteFlow,
    type Node,
    type Edge,
    Position,
    Panel,
    MarkerType, }  from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';
  
  // INTERNAL
  import Sidebar from './Sidebar.svelte';
  import ContextMenu from './ContextMenu.svelte';
  import {MainEntityNode, 
            AreaEntityNode, 
            LocalEntityNode,
            ControlledEntityNode,
            ControllerNode} from './nodes';
  import {NodePanel} from './panels'
  import { useDnD, getNodeColor } from './utils';
  import './flowstyles.css'

  const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  };

 
  

  // EXTRENAL VARIABLES
  export let maintop = "55px"
  export let load = (ev:any) =>{
      console.log("LOAD GRAPH")
  }
  export let save = (ev:any) =>{
      console.log("SAVE GRAPH")
  }
  export let nodeTypesNames = undefined
 

  // INTERNAL VARIABLES
  let nodePanelId = 'NodePanelId'

  export let  nodeTypes = {
    mainEntity: MainEntityNode,
    areaEntity: AreaEntityNode,
    localEntity: LocalEntityNode,
    controlledEntity: ControlledEntityNode,
    controller: ControllerNode,
  }

  export let defaultEdgeOptions = {
	arrowHeadType: 'arrowclosed',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: '#999999'
    }
  };

  // Nodes and Edges
  export let nodes:any = writable([
  ]);

  setContext('nodes', nodes);

  export let edges:any = writable([
  ]);

   setContext('edges', edges);

    onDestroy(() => {
  });
  export let menuitems:any = undefined
  export let width = '100vw'
  export let height = '70vh'
  export let minimap = true

  // ***** Manage Drag and Drop *****
  const { screenToFlowPosition } = useSvelteFlow();

  //const type = useDnD();
  const dndobject = useDnD()

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  let nodTyp:any = writable(null)
  let nodCol:any = writable(null)
  let internalData:any = writable({})

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    /*if (!$type) {
      return;
    }*/
    if (!$dndobject.type) {
      return;
    }else{
        $nodTyp = $dndobject.type
        $nodCol = $dndobject.color
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    const newid = Math.random() +''
    $internalData = {}
    const newNode:any = {
      id: newid,
      //type: $type,
      type: $nodTyp,
      position,
      data: { label: $nodTyp, color: $nodCol, spanid:'span-'+newid, internalData:$internalData },
      origin: [0.5, 0.0],
      ...nodeDefaults
    } satisfies Node;
    $nodes.push(newNode);
    $nodes = $nodes;
    // Hide panel on drop
    const nodePanel = document.getElementById(nodePanelId)
    const hideClicked = new CustomEvent("hidenodepanel", { detail: '' })
    nodePanel?.dispatchEvent(hideClicked)
  };

  // ***** Manage Context Menu *****
  let menu: { id: string; top?: number; left?: number; right?: number; bottom?: number } | null;
  let clientWidth: number;
  let clientHeight: number;

  function handleContextMenu({ detail: { event, node } }) {
    // Prevent native context menu from showing
    event.preventDefault();
    // Calculate position of the context menu. We want to make sure it
    // doesn't get positioned off-screen.
    menu = {
      id: node.id,
      top: event.clientY < clientHeight - 200 ? event.clientY : undefined,
      left: event.clientX < clientWidth - 200 ? event.clientX : undefined,
      right: event.clientX >= clientWidth - 200 ? clientWidth - event.clientX : undefined,
      bottom: event.clientY >= clientHeight - 200 ? clientHeight - event.clientY : undefined
    };
  }

  // Close the context menu if it's open whenever the window is clicked.
  function handlePaneClick() {
    menu = null;
  }

</script>

<div id="MainEditorDiv" style="top:{maintop};width:{width};height:{height};" bind:clientWidth={clientWidth} bind:clientHeight={clientHeight}>
  <Sidebar {load} {save} nodeTypesNames={nodeTypesNames} menuitems={menuitems}/>
  <SvelteFlow {nodes} 
               {edges} 
               fitView 
                on:dragover={onDragOver} 
                on:drop={onDrop}
                on:nodecontextmenu={handleContextMenu}
                on:paneclick={handlePaneClick}
                {nodeTypes}
                {defaultEdgeOptions}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    {#if menu}
      <ContextMenu
        onClick={handlePaneClick}
        id={menu.id}
        top={menu.top}
        left={menu.left}
        right={menu.right}
        bottom={menu.bottom}
      />
    {/if}
    {#if minimap}
	  <MiniMap />
	{/if}
    <Panel position="top-right">
        <NodePanel id={nodePanelId}/>
    </Panel>
  </SvelteFlow>
</div>

<style>

</style>
