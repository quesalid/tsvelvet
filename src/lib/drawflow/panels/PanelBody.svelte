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
        console.log("SET TITLE",ev.target.value,node,nodeDiv,ev.target.dataset)
        if(typeof(ev.target.dataset.name) == 'string' && ev.target.dataset.name == 'name')
        nodeDiv.innerHTML=ev.target.value
    }
}

const capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>
    
    <!--div class="drawflow-panel-body-container-class"-->
    {#each Object.keys(node.data) as Key}
        <div class="drawflow-panel-body-container-item">
            <span style="margin-right:10px;">{capitalizeFirstLetter(Key)}:</span>
            {#if typeof(node.data[Key]) == 'string'}
                <input  data-name="{Key}" type='text' size="25" bind:value='{node.data[Key]}' on:change={setTitle}/>
            {:else}
                <select data-name="{Key}" name="nodetype" id="nodetype-select" on:change={setTitle} bind:value={node.data[Key].name}>
                    <option value='pippo' selected>pippo</option>
                    <option value='pluto' selected>pluto</option>
                </select>
            {/if}
        </div>
    {/each}
         <div class="drawflow-panel-body-container-item">
            <CodeMirror bind:value lang={javascript()} />
        </div>
    <!--/!--div-->

<style>
:global(.drawflow-panel-body-container-item){
    display:flex;
    justify-content: space-between;
    margin-right: auto;
    margin-top: 2px;
}
:global(.drawflow-panel-body-container-item input[type="text"]){
    border:1px solid;
    padding-left: 2px;
    font-size:small;
}
:global(.drawflow-panel-body-container-item select){
    width: 189px;
    font-size:small;
    border:1px solid;
    padding-left: 2px;
}
</style>
