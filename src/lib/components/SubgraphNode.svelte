<script lang="ts">

export let node: any
export let deleteNodeClicked = (ev:any)=>{console.log("DELETENODE CLICKED")}
export let openGraphClicked = (ev:any)=>{console.log("DATANODE CLICKED")}

</script>

	<div class="node-wrapper-p" id="{'NW-'+node.id}" style="--background-color:{node.bgColor};">
		<div class="node-menu-p" style="--background-color:{node.bgColor};">
			<input type="button" value="OPEN" data-node="{'N-'+node.id}" on:click={openGraphClicked}/>
			<input type="button" value="DELETE" data-node="{'N-'+node.id}" on:click={deleteNodeClicked}/>
		</div>
		<div class="node-body-p" style="--background-color:{node.bgColor};">
			<div>{node.label}</div>
			<div>{node.nodetype}</div>
		</div>
	</div>

<style>

/*.node-wrapper{
	display:block;
	top: 0;
}*/
.node-wrapper-p{
  box-sizing: border-box;
  width:100%;
  height:100%;
  border-radius: 8px;
  position: absolute;
  top:0;
  left:0;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  padding: 1px;
  gap: 10px;
  border: 1px solid;
  background-color: var(--background-color);
}
.node-menu-p{
	display:flex;
	justify-content: right;
	background-color: var(--background-color);
}

.node-menu-p input{
	margin-right: 2px;
	cursor: pointer;
}

.node-body-p{
	display:block;
	text-align: center;
	background-color: var(--background-color);
}



</style>