<script lang="ts">
  import { Handle, Position, type NodeProps,NodeResizer, useNodes } from '@xyflow/svelte';
  import type { Writable } from 'svelte/store';
  import '../flowstyles.css'
 
  type $$Props = NodeProps;
 
  export let data: $$Props['data'] = undefined;
  export let selected: $$Props['selected'] = undefined;

  export let onResizeEnd = (ev:any,params:any)=>{
	  // Get the resized element
	  const element = document.getElementById(data.divid);
	  // Find the target
	 const target = ev.target
	  // Update the target with the new size
	  if(target && element){
		  element.style.width = `${width - 5}px`;
		  element.style.height = `${height - 5}px`;
	  }
	  //console.log("RESIZE END",params)
  };

  let width = 0;
  let height = 0;

  export let onResize = (ev:any,params:any)=>{
	  // update width and height
	  width = params.width;
	  height = params.height;
  }
  
  export let onResizeStart = (ev:any,params:any)=>{
	  // initialize width and height
	  const element = document.getElementById(data.divid);
	  if(element){
		  width = element.offsetWidth;
		  height  = element.offsetHeight;
	  }
  }


  const nodes = useNodes();
</script>
  <NodeResizer 
		isVisible={selected} 
		color="rgb(255, 64, 0)"  
		onResizeEnd={onResizeEnd}
		onResize={onResize}
		onResizeStart={onResizeStart}
		/>
  <div class="custom-entity-node-group" id={data.divid} >
	<div style="background-color: {data.color} ;">
		<div class="custom-entity-node-group-label" id={data.spanid}>{data.label}</div>
	</div>
  <div />
</div>