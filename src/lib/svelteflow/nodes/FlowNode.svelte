<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import type { Writable } from 'svelte/store';
  import '../flowstyles.css'
 
  type $$Props = NodeProps;
 
   export let data: any

</script>
 
<div class="custom-sdyn-node flow"  style="background-color: {data.color} ;">
  <Handle type="target" position={Position.Left} />
  <div >
		<div  class="custom-entity-node-label" id={data.spanid}>
			<input type="image" src="Flow.png" alt="flow" />
		</div>
  </div>
  <div />
  <Handle type="source" position={Position.Right} />
</div>