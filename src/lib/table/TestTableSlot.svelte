<script lang="ts">
export let data:any = []

</script>

<div class="window-menu-body">
	{#if $$slots.bodycontent}
		<slot name="bodycontent" data={data}></slot>
	{/if}
</div>

<style>
</style>