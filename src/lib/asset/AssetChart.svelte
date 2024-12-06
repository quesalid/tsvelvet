<script lang='ts'>
import * as echarts from 'echarts';
import { onMount } from 'svelte';

import * as theme from './chalkproject.json'
import { getOptionTmech, getOptionHistoric, getOptionDistribution, getOptionPolar} from './assetoptions'

let option:any
let myChart:any

onMount(() => {
	let chartDom = document.getElementById('chartmain');
    const chalk = theme.theme;
    console.log("theme",theme.theme)
    echarts.registerTheme('chalk', chalk);
	myChart = echarts.init(chartDom,'chalk');
    option = getOptionTmech(titletext,legendData,6,12,45,35);
    myChart.on('timelinechanged', function (params:any) {
        const currentIndex = params.currentIndex; // Ottieni l'indice selezionato nella timeline
        const timeKey = option.timeline.data[currentIndex]; // Ottieni la chiave temporale (es. '7:00')
        const xdata = option.xAxis.data;
        // ottieni i dati per l'indice selezionato
        let xdataIndex = getIndex(xdata,timeKey);
        // per ogni serie i dati della sottoserie ed aggiorna il grafico
        let subseries = [];
        const series = option.series;
        for (let i = 0; i < series.length; i++) {
            // controlla che non sia la serie dei markers
            if (series[i].name == 'markers') continue;
            let subserie = {name:series[i].name,type:series[i].type,data:getSubSeries(series[i],xdataIndex)}
            subseries.push(subserie);
		}
        // riaggiungi la serie dei markers
        const markerSerie = option.series[option.series.length-1];
        subseries.push(markerSerie);
        myChart.setOption({
			series: subseries
		});
       
        console.log('currentIndex',currentIndex,timeKey,xdataIndex);   
    });
	myChart.setOption(option);
});

// exports
export let titletext = "Tensione 8h (kN)";
export let width = '60vw';
export let height = '80vh';


// data una serie ed un indice torna una sottoserie compresa tra 0 e l'indice
const getSubSeries = (series:any, index:number) => {
	let subseries = [];
	subseries = series.data.slice(0,index);
	return subseries;
}

// dato un arreay di punti xdata ed un punto, torna l'indice del punto
const getIndex = (xdata:any, point:any) => {
	let index = xdata.indexOf(point);
	return index;
}

let selectedChart = "tmech";
let legendData = [
	{name:'4A',textStyle:{color:'white'}}, 
	{name:'4B',textStyle:{color:'white'}}, 
	{name:'8A',textStyle:{color:'white'}},
	{name:'8B',textStyle:{color:'white'}},
	{name:'12A',textStyle:{color:'white'}},
	{name:'12B',textStyle:{color:'white'}},
]

const changeGraph = () => {
    const historicdata = legendData.map((item) => {return item.name})
    console.log("changeGraph", selectedChart,historicdata);
    switch(selectedChart){
		case "tmech":
			option = getOptionTmech(titletext,legendData,6,12,45,35);
			break;
		case "historic":
            option = getOptionHistoric(historicdata,'2024-01-01');
			break;
		case "distribution":
			option = getOptionDistribution();
			break;
		case "polar":
			option = getOptionPolar();
		break;
    }
    console.log("locoption",option)
    if(myChart)
        myChart.dispose();
    myChart = echarts.init(document.getElementById('chartmain'),'chalk');
    if(option.timeline){
		myChart.on('timelinechanged', function (params:any) {
			const currentIndex = params.currentIndex; // Ottieni l'indice selezionato nella timeline
			const timeKey = option.timeline.data[currentIndex]; // Ottieni la chiave temporale (es. '7:00')
			const xdata = option.xAxis.data;
			// ottieni i dati per l'indice selezionato
			let xdataIndex = getIndex(xdata,timeKey);
			// per ogni serie i dati della sottoserie ed aggiorna il grafico
			let subseries = [];
			const series = option.series;
			for (let i = 0; i < series.length; i++) {
				// controlla che non sia la serie dei markers
				if (series[i].name == 'markers') continue;
				let subserie = {name:series[i].name,type:series[i].type,data:getSubSeries(series[i],xdataIndex)}
				subseries.push(subserie);
			}
			// riaggiungi la serie dei markers
			const markerSerie = option.series[option.series.length-1];
			subseries.push(markerSerie);
			myChart.setOption({
				series: subseries
			});
		
			console.log('currentIndex',currentIndex,timeKey,xdataIndex);   
		});
	}
	myChart.setOption(option);
}

</script>
    <div class= "outer-chart-class" style="width: 600px; height: 400px;">
	    <div id="chartmain" style="width: {width};height: {height};"></div>
        <div class="bottom-buttons">
            <button on:click={changeGraph}>
                Select
            </button>
            <select bind:value={selectedChart}>
                <option value="tmech">Tensione meccanica (8h)</option>
				<option value="historic">Tensione meccanica (media)</option>
				<option value="distribution">Distribuzione</option>
				<option value="polar">Lissajoux</option>
            </select>
        </div>
    </div>
	

<style>
	.outer-chart-class{
        width: 80vw;
        height: 100vh;
	}
	.bottom-buttons{
		left: 0;
		width: 60vw;
		display: flex;
		justify-content: left;
        background-color: rgba(41,52,65,0.88);
	}
    .bottom-buttons button{
        background-color: rgba(31,42,55,1);
		border: 1px solid white;
		color: white;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 12px;
		margin: 5px 5px 5px 10px;
		cursor: pointer;
		border-radius: 12px;
		padding: 3px 14px;
    }
    .bottom-buttons select{
        background-color: rgba(31,42,55,1);
        border: 1px solid white;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 5px 5px 5px 10px;
        width: 200px;
    }
</style>