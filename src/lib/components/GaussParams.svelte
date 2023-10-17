<script lang="ts">
// https://math.stackexchange.com/questions/1332879/conditional-probability-combining-discrete-and-continous-random-variables

import {onMount} from "svelte"

//export let value : any
export let node: any
export let graph: any = {nodes:[],edges:[]}
export let defDistPar:any
export let i:any
export let index:any
export let col:any



onMount(()=>{
		
})




</script>
     <div class="bayes-node-gauss-value" id="{'NWC-'+node.id+'-'+node.label}">
		 <label for={'NW-Mean'+node.id+'_'+i}>Mean: </label>
         <input size="4" type="text" name={'NW-Mean-'+node.id+'_'+i} data-col={i} data-row={index} value={col.mean} on:change={defDistPar} />
		 <label for={'NW-Var'+node.id+'_'+i}>Variance: </label>
         <input size="4" type="text" name={'NW-Var-'+node.id+'_'+i} data-col={i} data-row={index} value={col.variance} on:change={defDistPar} />
	 </div>
<style>

.bayes-node-gauss-value{
	display:flex;
	flex-direction:column;
    padding-bottom: 20px;
    cursor: pointer;
}
.bayes-node-gauss-value input{
	margin-right: 3px;
}
</style>