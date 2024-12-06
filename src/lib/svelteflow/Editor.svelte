<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte';

  import Flow from './Flow.svelte';
  import DnDProvider from './DnDProvider.svelte';
  import {MainEntityNode, 
            AreaEntityNode, 
            LocalEntityNode,
            ControlledEntityNode,
            ControllerNode,
            PhaseNode,
            TaskNode,
            ProcessNode} from './nodes';

  // EXTRENAL VARIABLES
  export let maintop = "55px"
  export let load = (ev:any) =>{
      console.log("LOAD GRAPH")
  }
  export let save = (ev:any) =>{
      console.log("SAVE GRAPH")
  }

export let nodeTypesNames =undefined 
export let nodeTypes:any =undefined
export let menuitems = undefined
export let minimap = false
export let width = undefined
export let height = undefined

</script>

<SvelteFlowProvider>
  <DnDProvider>
        <Flow 
            {load} 
            {save} 
            maintop = {maintop} 
            nodeTypesNames={nodeTypesNames} 
            {nodeTypes} 
            {menuitems}
            {minimap}
            {width}
            {height}/>
  </DnDProvider>
</SvelteFlowProvider>
