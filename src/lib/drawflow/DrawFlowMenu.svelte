<script lang='ts'>
import DFEDITOR from './grapheditor.js'
import NODETYPES from './nodetypes.js'


/*  EXAMPLES OF NODE TYPES
NODETYPES.addNodeType(`button`,1,2,{id:'pippo'},`button`,`<button onclick="_myonclick({id:'pippo'})">Button</button>`)
NODETYPES.addNodeType(`link`,1,2,{id:'pluto'},`link`,`<a href="#"  onclick="_myonclick({id:'pluto'})">Visit W3Schools.com!</a>`)
NODETYPES.addNodeType(`image`,1,2,{id:'minnie'},`image`,`<input type="image" src="/GRAPH.svg" alt="GRAPH.svg" onclick="_myonclick({id:'minnie'})"/>`)
NODETYPES.addNodeType(`combo`,1,2,{id:'topo'},`combo`,
                        `<div style="display:block;">
                            <div style="display:flex;margin:3px;">
                                <label style="margin-right:3px;">Button</label>
                                <button onclick="_myonclick({id:'pippo'})">Button</button>
                            </div>
                            <div style="display:fles;margin:3px;">
                                <input type="image" src="/GRAPH.svg" alt="GRAPH.svg" onclick="_myonclick({id:'topo'})"/>
                            </div>
                        </div>`)
*/
export let nodetypes = NODETYPES.getAllNodeType()

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