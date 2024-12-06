<script lang='ts'>

export let asset: any = null

let assetFormatted: any = {}
let assetGraphManagerId = 'defaultAssetGraphManager'

const statoLeft = {
		mis: ['MIS','4A', '4B', '8A', '8B', '12A', '12B'],
		tm: ['TM','', '', '', '', '', ''],
		c: ['°C','80', '85', '91', '89', '91', '92'],
		inc: ['INC','0°', '1°', '-2°', '1°', '2°', '3°']
	}

const statoRight = {
		mis: ['MIS','4C', '4D', '8C', '8D', '12C', '12D'],
		tm: ['TM','', '', '', '', '', ''],
		c: ['°C','80', '85', '91', '89', '91', '92'],
		inc: ['INC','0°', '1°', '-2°', '1°', '2°', '3°']
	}
const formatAsset = (asset:any) => {
	assetFormatted.code = asset && asset.userData && asset.userData.id? asset.userData.id:'ASSET-NAME';
	assetFormatted.sensors = asset && asset.userData && asset.userData.sensors? asset.userData.sensors:['SB8901-1', 'SB8901-2', 'SB8901-3', 'SB8901-4', 'SB8901-5', 'SB8901-6'];
	assetFormatted.alarmLeft = asset && asset.userData && asset.userData.alarmLeft?asset.userData.alarmLeft:['ALARM', '0', '1', '1', '2', '0', '0'],
	assetFormatted.alarmRight = asset && asset.userData && asset.userData.alarmRight? asset.userData.alarmRight:['ALARM', '0', '0', '1', '1', '0', '0'],
	assetFormatted.statoLeft = asset && asset.userData && asset.userData.statoLeft?asset.userData.statoLeft: statoLeft;
	assetFormatted.statoRight = asset && asset.userData && asset.userData.statoRight?asset.userData.statoRight: statoRight;
}


formatAsset(asset) 

const togglePanel = () => {
    const panel:any = document.querySelector('.map-panel');
    //  shrink or expand the panale width
    panel.style.width = panel && panel.style.width === '18.6vw' ? '5vw' : '18.6vw';
	const togglepanel:any = document.querySelector('#toggle-panel');
    // hide or show the panle content
    togglepanel.style.display = togglepanel && togglepanel.style.display === 'block' ? 'none' : 'block';	
}

const callAssetGraph = (ev:any,asset:any) => {
    // send show event to assetGraphManager
    const assetGraphManager = document.getElementById(assetGraphManagerId);
    assetGraphManager?.dispatchEvent(new CustomEvent('show', {detail:asset}))
}

$: {
	if(asset)
	    formatAsset(asset)
}
</script>

<div class="map-panel">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="map-panel-header"  on:click={togglePanel}>
            <h3>ASSET</h3>
            <span>-</span>
        </div>
        <div id="toggle-panel">
        <p>Codice: [ <span style="color:yellow;">{assetFormatted.code}}</span> ]</p>
        <p>Sensori: [ <span style="color:yellow;">SB8901-1/2/3/4/5/6</span> ]</p>
        <p>Stato: LEFT </p>
            <table>
            {#each Object.keys(assetFormatted.statoLeft) as key, i}<tr>
					{#each assetFormatted.statoLeft[key] as value, j}
                        {#if value == '' && assetFormatted.alarmLeft[j] == '0'}
						    <td><div style="background-color: springgreen;">{value}</div></td>
                        {:else if value == '' && assetFormatted.alarmLeft[j] == '1'}
							<td><div style="background-color: orange;">{value}</div></td>
                        {:else if value == '' && assetFormatted.alarmLeft[j] == '2'}
                            <td><div style="background-color: red;">{value}</div></td>
                        {:else}
                            <td>{value}</td>
                        {/if}
					{/each}
				</tr>
			{/each}
            </table>
         <input type="button" value="Grafici Left" on:click={(ev)=>{callAssetGraph(ev,asset)}}/>
        <p>Stato: RIGHT </p>
            <table>
            {#each Object.keys(assetFormatted.statoRight) as key, i}<tr>
					{#each assetFormatted.statoRight[key] as value, j}
                        {#if value == '' && assetFormatted.alarmRight[j] == '0'}
						    <td><div style="background-color: springgreen;">{value}</div></td>
                        {:else if value == '' && assetFormatted.alarmRight[j] == '1'}
							<td><div style="background-color: orange;">{value}</div></td>
                        {:else if value == '' && assetFormatted.alarmRight[j] == '2'}
                            <td><div style="background-color: red;">{value}</div></td>
                        {:else}
                            <td>{value}</td>
                        {/if}
					{/each}
				</tr>
			{/each}
            </table>
        <input type="button" value="Grafici Right" on:click={(ev)=>{callAssetGraph(ev,asset)}}/>
        </div>
  </div>


<style>
.map-panel {
    position: absolute;
    top: 10vh; /* Spazio dal bordo inferiore */
    left: 4px; /* Spazio dal bordo sinistro */
    background-color: rgba(0, 0, 0, 0.55); /* Sfondo semi-trasparente */
    border: 1px solid #ccc; /* Bordo sottile */
    border-radius: 8px; /* Angoli arrotondati */
    padding: 5px; /* Spaziatura interna */
    z-index: 1; /* Assicura che sia sopra la mappa */
    width: 18.6vw;
    color: white;
    font-family: 'Orbitron', sans-serif;
    font-size: smaller;
  }
.map-panel-header{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #fff;
}

.map-panel-header span{
	cursor: pointer;
    font-size: larger;
    font-weight: bold;
}

.map-panel table{
    	width: 16vw;
}
.map-panel table tr {
     background-color: rgba(0, 0, 0, 0.0);
     font-size: smaller;
}
.map-panel table td {
     font-size: smaller;
}
.map-panel table tr th{
     background-color: rgba(0, 0, 0, 0.0);
     font-size: smaller;
     width: 20px;
}
.map-panel table tr td div{
    border: 1px solid white;
    border-radius: 20px;
    height: 12px;
    width: 12px;
    padding-bottom: 3px;
}
.map-panel input[type="button"]{
	text-align: center;
	text-decoration: none;
	display: inline-block;
	margin: 4px 2px;
	cursor: pointer;
	border-radius: 4px;
    border: 1px solid white;
    background-color: rgba(105, 105, 105, 1);
}
</style>