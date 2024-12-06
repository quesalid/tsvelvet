<script lang='ts'>
import { onMount } from 'svelte';

import {Asset} from './asset'

onMount(async () => {
	//buildAssetFromCoords(rdp_udsud)
})

export let assets = []
export let structures = ['Struttura 1','Struttura 2','Struttura 3']
export let mapClass = 'map-container'

let sortColumn = ''; // Colonna corrente per il sorting
let sortDirection = 1; // 1 = Ascendente, -1 = Discendente
let selecetedStructure = 'Struttura 1'

const buildAssetFromCoords = (coords: number[][]) => {
	for(let i = 0; i < coords.length; i++){
		const asset = new Asset(coords[i],null);
		if(i%5 == 0)
			asset.setUserData({id:'Asset_'+i,status:'WARNING'});
		else if(i%7 == 0)
			asset.setUserData({id:'Asset_'+i,status:'ALARM'});
		else 
			asset.setUserData({id:'Asset_'+i,status:'NORMAL'});
        if(i == 0 || i == coords.length-1){
		    asset.addField('description','stazione trasformazione')
            asset.addField('type','trasformator')
        }else{
			asset.addField('description','linea elettrica')
			asset.addField('type','traliccio')}
		assets.push(asset);
	}
	console.log(assets)
	// forza il re-rendering
	assets = [...assets]
}

let rdp_udsud = [
	[13.471033574202934, 45.85175337043916, 200],
	[13.46887710880064, 45.85166383155799, 200],
	[13.464776641631351, 45.85232698092819, 200],
	[13.460000923650009, 45.85315269243209, 200],
    [13.455210296215855, 45.85241464295666, 200],
    [13.450542801534054, 45.85231740018976, 200],
    [13.44505195689818, 45.85224297923758, 200],
    [13.440372959758156, 45.85264705377735, 200],
    [13.43491566711406, 45.853145201118316, 200],
    [13.430552649969458, 45.85374031215768, 200],
    [13.427054412283702, 45.85425048747848, 200],
    [13.42180239528584, 45.85469186472455, 200],
    [13.421753083471454, 45.85477640549971, 200],
    [13.42049752877672, 45.856784211169646, 200],
    [13.419075072517051, 45.85909838146707, 200],
    [13.417231569217059, 45.86211775336656, 200],
    [13.414944259553529, 45.86584485333895, 200],
    [13.412842256462007, 45.86940123416414, 200],
    [13.410700121573068, 45.872928602028615, 200],
    [13.409024382824242, 45.87626183308792, 200],
    [13.407730604141983, 45.879269523343716, 200],
    [13.405790138711938, 45.883102613795984, 200],
    [13.404673390576106, 45.88535190067511, 200],
    [13.401449156409143, 45.88716849668964, 200],
	[13.397964200555625, 45.889176883277486, 200],
	[13.393997700459533, 45.89144838751932, 200],
	[13.390497942214385, 45.8941214339159, 200],
    [13.387071330745606, 45.896817549729164, 200],
    [13.383708066508717, 45.899508680937736, 200],
    [13.380488647981107, 45.90207119265619, 200],
    [13.377430534947708, 45.904495986850016, 200],
    [13.374393238607812, 45.90689393176899, 200],
    [13.371921326740082, 45.90885788036059, 200],
    [13.368830462308601, 45.91130921261307, 200],
    [13.365567464319943, 45.91382065050609, 200],
    [13.362734735836513, 45.914786797388075, 200],
    [13.358106067172415, 45.91618069663717, 200],
    [13.355244373386684, 45.917071419328344, 200],
    [13.35189875631175, 45.918063650495355, 200],
    [13.347889485540682, 45.919268640789234, 200],
    [13.343076806040843, 45.91965574702892, 200],
    [13.338048063988897, 45.920019261652214, 200],
    [13.332570960307958, 45.920426599116404, 200],
    [13.327696565621824, 45.920785249222355, 200],
    [13.32323639294551, 45.92113773632758, 200],
    [13.319594100618815, 45.92387639472775, 200],
    [13.315751587018477, 45.92683995804946, 200],
	[13.312192114997028, 45.929493474069304, 200],
	[13.310873017679514, 45.93216340236006, 200]
	]

const flyTo = (ev:any,asset:any) => {
	console.log("FLYTO ",asset)
    // send the event to mapClass component
    const event = new CustomEvent('flyToAsset', {detail: asset});
    const target = document.querySelector('.'+mapClass);
    target.dispatchEvent(event);
}

// Funzione per l'ordinamento
const sortBy = (column:any) => {
    if (sortColumn === column) {
        sortDirection *= -1; // Inverti l'ordine se clicchi sulla stessa colonna
    } else {
        sortColumn = column;
        sortDirection = 1; // Ripristina ordine ascendente
    }

    assets.sort((a, b) => {
        const valueA = a.userData[column];
        const valueB = b.userData[column];

        // Confronta in base al tipo di dato (numerico o stringa)
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return (valueA - valueB) * sortDirection;
        } else {
            return valueA.localeCompare(valueB) * sortDirection;
        }
    });

    assets = [...assets]; // Forza il re-rendering
};

const selectStructure = (ev) => {
	selecetedStructure = ev.target.value
	console.log(selecetedStructure)
}

</script>
	<div class="asset-comp-class">
    <div class="asset-comp-header">
         <div class="asset-comp-title">Elenco degli Asset</div>
         <!-- structure selection-->
         <div class="asset-comp-structure">
             <span>Struttura:</span>
			<select on:change={selectStructure}>
                {#each structures as structure}
                    <option value={structure}>{structure}</option>
				{/each}
			</select>
        </div>
    </div>
    <div class="asset-comp-body">
        <!-- tabella con colonne ordinabili e ricercabili -->
        <table>
            <thead>
                <tr>
                    <th on:click={() => sortBy('id')}>Id {sortColumn === 'id' ? (sortDirection === 1 ? '▲' : '▼') : ''}</th>
                    <th on:click={() => sortBy('type')}>Type {sortColumn === 'type' ? (sortDirection === 1 ? '▲' : '▼') : ''}</th>
                    <th on:click={() => sortBy('status')}>Status {sortColumn === 'status' ? (sortDirection === 1 ? '▲' : '▼') : ''}</th>
                    <th>Flyto</th>
                </tr>
            </thead>
            <tbody>
                {#each assets as asset}
                    <tr>
                        <td>{asset.userData.id}</td>
                        <td>{asset.userData.type}</td>
                        {#if asset.userData.status == 'NORMAL'}
                            <td style="background-color: green;">{asset.userData.status}</td>
                        {:else if asset.userData.status == 'WARNING'}
                            <td style="background-color: orange;font-weight:bold;">{asset.userData.status}</td>
                        {:else if asset.userData.status == 'ALARM'}
                            <td style="background-color: red;font-weight:bold;">{asset.userData.status}</td>
                        {:else}
                            <td>{asset.userData.status}</td>
                        {/if}
                        <td class="td-clickable" on:click={(ev)=>{flyTo(ev,asset)}}>&#9655;</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
.asset-comp-class{
	font-family: 'Orbitron', sans-serif;
	width: 28vw;
	height: 100%;
	font-size: smaller;
}

.asset-comp-header{
    display: flex;
	justify-content:space-between;
	align-items: left;
	height: 10%;
    background-color: rgba(100, 100, 100, 0.8);
    color: white;

}
.asset-comp-structure{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px;
    width: 60%;
}
.asset-comp-structure select{
    width: 100%;
	padding: 5px;
	border-radius: 5px;
	border: 1px solid #ccc;
	background-color: white;
	color: black;
	font-weight: bold;
	cursor: pointer;
}
.asset-comp-title{
    font-size: larger;
	font-weight: bold;
	padding: 5px;
    text-align: left ;
}
.asset-comp-body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%; /* Altezza totale disponibile */
}

.asset-comp-body table {
    border-collapse: collapse;
    width: 100%;
}

.asset-comp-body thead {
    position: sticky;
    top: 0;
    z-index: 2; /* Per sovrapporsi alle righe della tabella */
    background-color: rgba(0, 0, 0, 0.8); /* Mantieni uno sfondo per distinguere */
}

.asset-comp-body thead tr{
     display: table;
    width: 100%;
    table-layout: fixed; /* Allinea correttamente le celle */
}

.asset-comp-body tbody {
    display: block;
    max-height: 400px; /* Altezza massima per il contenitore delle righe */
    overflow-y: auto;
    overflow-x: hidden;
}

.asset-comp-body tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed; /* Allinea correttamente le celle */
}
.td-clickable{
	cursor: pointer;
}

th {
    cursor: pointer;
    position: relative;
    user-select: none;
}

th::after {
    content: '';
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
}

th:hover {
    color: #999; /* Colore di evidenziazione */
}
</style>