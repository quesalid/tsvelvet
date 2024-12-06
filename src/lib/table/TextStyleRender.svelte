<script lang="ts">

export let image:any = "/BUDDY.png"
export let style  = "enabled;"
export let onClick:any = null
export let name = 'text-generic'
export let uid = ''
export let value = ''
export let height:any = "25"
export let classname = "image-tool-component"

</script>
	<div class="text-tool-component-div">
		<!--button id="{name+'-'+uid}" style="{style}" class="text-tool-component {classname} " data-uid={uid} on:click={onClick}>{value}</!--button-->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div id="{name+'-'+uid}" style="{style}" class="text-tool-component blinking-text {classname} "  data-uid={uid} on:click={onClick}>{value}</div>
	</div>
<style>


.text-tool-component-div {
	margin: 2px 2px 2px 2px;
	opacity: 0.8;
	text-align: center;
}
.unblinking-text {
	text-align: center;
	margin-top: 20%;
	/*font-size: 24px;*/
	font-weight: bold ;
	color: red;
	cursor: pointer;
}
@keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        .blinking-text {
            text-align: center;
            margin-top: 20%;
            font-size: larger;
            font-weight: bold ;
            color: red;
            animation: blink 3s infinite;
            cursor: pointer;
        }


</style>