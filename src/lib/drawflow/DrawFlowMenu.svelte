<script lang='ts'>
import DFEDITOR from './grapheditor.js'

//export const drag = (event) =>{}
const getTitle = (title:any) =>{
    const ret = '<div class="title-box">'+ title+'</div>'
    return(ret)
}
const getContent = (content:any)=>{
    const ret = '<div class="box">'+ content+'</div>'
    return(ret)
}
export let nodetypes = [
        {
            name:'facebook',
            inputs:0,
            outputs:1,
            x:0,
            y:0,
            params:{type:'facebook'},
            title:getTitle("Facebook Message"),
            content: getTitle("Facebook Message")+getContent(""),
        },
        {
            name:'email',
            inputs:1,
            outputs:0,
            x:0,
            y:0,
            params:{type:'email'},
            title:getTitle("Send Email"),
            content: getTitle("Send Email")+getContent(""),
        },
        {
            name:'middlenode',
            inputs:1,
            outputs:1,
            x:0,
            y:0,
            params:{type:'middlenode'},
            title:getTitle("Middel Node"),
            content: getTitle("Middel Node")+getContent("Box content"),
        }
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