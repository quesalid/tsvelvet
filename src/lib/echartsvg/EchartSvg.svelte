<script lang='ts'>
import * as echarts from 'echarts';
import { onMount } from 'svelte';

var chartDom = document.getElementById('main');
let myChart:any 

let option = {
    tooltip: {},
    visualMap: {
      left: 'center',
      bottom: '10%',
      min: 5,
      max: 100,
      orient: 'horizontal',
      text: ['', 'Price'],
      realtime: true,
      calculable: true,
      show:false,
      inRange: {
        color: ['#dbac00', '#db6e00', '#cf0000']
      }
    },
    series: [
      {
        name: 'Centrale Salisano',
        type: 'map',
        map: 'salisano.svg',
        roam: true,
        emphasis: {
          label: {
            show: false
          }
        },
        selectedMode: false,
        data: [
          { name : 'EDIFICIO_UNO', value: 15 },
          { name: 'EDIFICIO_DUE', value: 35 },
          { name: 'SOSTEGNI_LINEE', value: 15 },
          { name: 'Recinto_3', value: 25 },
          { name: 'Recinto_2', value: 45 },
          { name: 'TRALICCIO_UNO', value: 85 },
          { name: 'CENTRALE', value: 25 },
          { name: 'TRALICCIO_DUE', value: 15 },
          { name: 'Recinto_1', value: 55 },
          { name: "PASSANTE_UNO", value: 25 },
          { name: 'PASSANTE_DUE', value: 65 },
          { name: 'PASSANTE_TRE', value: 45 },
        ]
      }
    ]
  };

  async function loadSVG(path) {
  const response = await fetch(path);
  const svgText = await response.text();
  return svgText;
}

  onMount(async () => {
    try{
    //let mySvg = await loadSVG();
    let mySvg = await loadSVG('../../../public/salisano.svg')
    console.log(mySvg)
    echarts.registerMap('salisano.svg', { svg: mySvg });
    var chartDom = document.getElementById('chartmain');
    myChart = echarts.init(chartDom);
	myChart.setOption(option);
    // Aggiungi l'evento click
    myChart.on('click', function (params) {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        console.log('Elemento cliccato:', params.name);
        //alert(`Hai cliccato su: ${params.name} con valore ${params.value}`);
      }
    });

    // Rimuovi il listener all'unmount del componente
    return () => {
      myChart.dispose();
    };
    }catch(e){
		console.log(e)
	}
  });
</script>
    <div id="chartmain" style="width: 500px;height: 500px;"></div>
<style>
</style>