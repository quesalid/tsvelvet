<script lang="ts">

export let node:any = {}
</script>

	<div class="node-inspector-class">
		<div class="node-inspector-item-class"><span>ID </span><span>{node.uid}</span></div>
		{#if node.anchors}
			<div class="node-inspector-item-class">INPUTS</div>
			{#each node.anchors as Anchor}
				{#if Anchor.input}
					<div class="node-inspector-item-class"><span>AID </span><span>{Anchor.id}</span></div>
					{#if Anchor.connections}
						<div class="node-inspector-item-class">INPUT CONNECTIONS</div>
						{#each Anchor.connections as Connection}
							<div class="node-inspector-item-class"><span>FROM </span><span>{Connection[1]}</span></div>
						{/each}
					{/if}
				{/if}
			{/each}
			<div class="node-inspector-item-class">OUTPUTS</div>
			{#each node.anchors as Anchor}
				{#if Anchor.output}
					<div class="node-inspector-item-class"><span>AID </span><span>{Anchor.id}</span></div>
					{#if Anchor.connections}
						<div class="node-inspector-item-class">OUTPUT CONNECTIONS</div>
						{#each Anchor.connections as Connection}
							<div class="node-inspector-item-class"><span>TO </span><span>{Connection[1]}</span></div>
						{/each}
					{/if}
				{/if}
			{/each}
		{/if}
	</div>

<style>
.node-inspector-class{
	display:flexbox;
}
.node-inspector-class div{
	display:flex;
	justify-content:space-between ;
	margin-left: auto;
}
span{
	font-size: 10px;
}
</style>