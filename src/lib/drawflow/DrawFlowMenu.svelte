<script lang='ts'>
import DFEDITOR from './grapheditor.js'
import NODETYPES from './nodetypes.js'


export let nodetypes = NODETYPES.getAllNodeType('DATA')

</script>
      {#each nodetypes as Node}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="drag-drawflow" draggable="true" on:dragstart={(ev)=>{DFEDITOR.drag(ev)}} data-node={JSON.stringify(Node)}>
        {@html Node.title}
      </div>
      {/each}

<style>
:global(.drag-drawflow) {
  --border-color: #a9a9a9;
  line-height: 35px;
  border-bottom: 1px solid var(--border-color);
  padding-left: 20px;
  cursor: move;
  user-select: none;
}
</style>