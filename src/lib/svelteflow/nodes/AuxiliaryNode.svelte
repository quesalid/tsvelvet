<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import type { Writable } from 'svelte/store';
  import '../flowstyles.css'
 
  type $$Props = NodeProps;
 
   export let data: any

</script>
 
<div class="custom-sdyn-node auxiliary"  style="background-color: {data.color} ;">
  <Handle type="target" position={Position.Left} />
  <Handle type="target" position={Position.Top} />
  <div >
		<div  class="custom-entity-node-label" id={data.spanid}>{data.label}</div>
  </div>
  <div />
  <Handle type="source" position={Position.Right} />
  <Handle type="source" position={Position.Bottom} />
</div>