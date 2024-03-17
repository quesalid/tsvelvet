<script>
import DFEDITOR from './grapheditor.js'

//export const drag = (event) =>{}
export let nodetypes = [
        {name:'facebook',
        inputs:0,
        outputs:1,
        x:0,
        y:0,
        params:{pippo:'pippo'},
        title:'<div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>',
        content: '<div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>'},
        {name:'email',
        inputs:1,
        outputs:0,
        x:0,
        y:0,
        params:{},
        title:'<div class="title-box"><i class="fab fa-facebook"></i> Send Email</div>',
        content: '<div class="title-box"><i class="fab fa-facebook"></i> Send Email</div>'}
]
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