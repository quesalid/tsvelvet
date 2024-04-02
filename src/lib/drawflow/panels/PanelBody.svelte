<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";

export let node:any ={name:'',callback:'',data:{}}
let value='function(input,output){\n}'
// On node name change set node html title 
const setTitle = (ev:any)=>{
    // GET NODE
    const nodeDiv = document.getElementById('title-box-'+node.id)
    if(nodeDiv){
        //node.data.name = ev.target.value
        console.log("SET TITLE",ev.target.value,node.data,nodeDiv)
        nodeDiv.innerHTML=ev.target.value
    }
    
    
}
</script>
    
    <!--div class="drawflow-panel-body-container-class"-->
        <div class="drawflow-panel-body-container-item">
            <span style="margin-right:10px;">Name:</span>
            <input  type='text' size="15" bind:value='{node.data.name}' on:change={setTitle}/>
        </div>
         <div class="drawflow-panel-body-container-item">
            <CodeMirror bind:value lang={javascript()} />
        </div>
    <!--/!--div-->

<style>
:global(.drawflow-panel-body-container-item){
    display:flex;
    justify-content: space-between;
    margin-right: auto;
}
:global(.drawflow-panel-body-container-item input[type="text"]){
    border:1px solid;
    padding-left: 2px;
    font-size:small;
}
:global(.drawflow-panel-body-container-item textarea){
    border:1px solid;
    padding-left: 2px;
    font-size:small;
}
</style>
