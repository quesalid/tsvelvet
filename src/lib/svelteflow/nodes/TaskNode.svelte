<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import type { Writable } from 'svelte/store';
  import '../flowstyles.css'
 
  type $$Props = NodeProps;
 
  export let data: any

</script>
 
<div class="custom-entity-node-short" >
  <Handle type="target" position={Position.Left} />
  <div class="custom-entity-node-short-div" style="background-color: {data.color} ;">
		<div  class="custom-entity-node-short-label" id={data.spanid}>{data.label}</div>
  </div>
  <div />
  <Handle type="source" position={Position.Right} />
</div>