<script lang='ts'>
import DFEDITOR from './grapheditor.js'
import NODETYPES from './nodetypes.js'

window._myonclick = (ev:any) =>{
    console.log("MYALERT",ev)
}

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
NODETYPES.addNodeType(`start`,0,1,{id:'topo'},`start`,
                        `<div style="min-height:18px;">
                            <svg id="svg-pippo" xmlns="http://www.w3.org/2000/svg" 
	                            viewBox="0 -960 960 960" 
                                class="svg-box-stroke">
	                            <path id="path-pippo"  stroke-width="100.04" d="M1899 1023.999c0-483.252-391.75-874.995-875-874.995S149 540.747 149 1024c0 483.251 391.75 875.004 875 875.004s875-391.753 875-875.004z"/>
                            </svg>
                        </div>`)
NODETYPES.addNodeType(`stop`,0,1,{id:'topo'},`stop`,
                        `<div style="min-height:18px;">
                            <svg id="svg-pippo" xmlns="http://www.w3.org/2000/svg" 
	                            viewBox="0 -960 960 960" 
                                class="svg-box-fill">
	                            <path id="path-pippo" d="M1015.043 99.002C599.21 95.906 209.098 411.147 121.606 817.247c-84.386 356.719 66.704 754.625 369.312 962.585c293.721 210.37 712.33 226.857 1017.865 31.474c307.224-188.136 488.14-563.828 430.814-921.32c-52.494-370.583-348.523-692.886-716.13-769.06c-68.345-15.248-138.415-22.388-208.424-21.924m22.08 289.882c305.56-.968 586.24 251.915 617.383 556.116c39.755 290.762-147.702 594.914-429.537 682.33c-275.076 93.609-606.772-25.852-750.075-281.009c-158.564-264.725-91.1-641.965 160.165-825.757c113.947-87.919 258.202-134.99 402.064-131.68"/>
                            </svg>
                        </div>`)
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