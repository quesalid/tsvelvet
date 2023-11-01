<script lang="ts">

export let node: any
export let graph: any = {nodes:[],edges:[]}
export let deleteNodeClicked = (ev:any)=>{console.log("DELETENODE CLICKED")}
export let dataNodeClicked = (ev:any)=>{console.log("DATANODE CLICKED")}
export let distNodeClicked = (ev:any)=>{console.log("DISTNODE CLICKED")}
export let distDefClicked = (ev:any)=>{console.log("DISTDEF CLICKED")}



</script>

	<div class="node-wrapper-p" id="{'NW-'+node.id}" >
		<div class="node-menu-p" style="--background-color:{node.bgColor};">
			<div style="text-align: center ;">
				<input id="label" size="5" class="node-datacomp" value="{node.graphtype}" type="text" min="0" style="text-align: left;"/>
			</div>
			<input type="button" value="DATA" data-node="{'N-'+node.id}" on:click={dataNodeClicked}/>
			<input type="button" value="X" data-node="{'N-'+node.id}" on:click={deleteNodeClicked}/>
		</div>
		<div class="node-body-p">
			<div class="node-body-left-p">
				<div style="font-weight:bold;">{node.label}</div>
				<div>{node.nodetype}</div>
			</div>
			<div class="node-body-right-p">
			</div>
		</div>
	</div>

<style>


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
  border: 3px solid;
  background-color: white;
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

.node-body-p {
	display:inline-flex;
	margin-left: 5px;
}

.node-body-left-p{
	display:flexbox;
	justify-content: left;
	float: left;
	width: 50%;
	padding: 10px;
}

.node-body-right-p{
  display:flexbox;
  justify-content:center;
  float: left;
  padding: 10px;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border-color: #222;
  border: 1px solid;
}


.node-datacomp{
		-webkit-border-radius: 30px;
		-moz-border-radius: 30px;
		 border-radius: 30px;
		 border: 1px solid #2d9fd9;
		 background-color: #FFFFFF;
		 color: #777777;
		 padding-left: 10px;
		 text-align: center;
	}

</style>