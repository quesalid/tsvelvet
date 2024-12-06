<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as echarts from "echarts";

  import './nnstyle.css'



  export let trainingResults = [];
  export let callbackNumber = 0;
  export let containerId = "echart-container-id";
  let chartInstance:any;
  let chartDom:any
  let eventListener:any;
  //let ctx;
  let lossData = [];
  let labels = [];

  // Configura il grafico dopo il montaggio del componente
  onMount(() => {
	lossData = trainingResults.map(res => res.error || 0);
	labels = trainingResults.map(res => res.iterations || 0)
	option.xAxis.data = labels;
	option.series[0].data = lossData;
	initChart(option);
	// add event listner for data changed
	const me = document.getElementById(containerId);
	eventListener = me.addEventListener("dataChanged", (e:any) => {
		//console.log("data changed event",e.detail);
		updateChart(e.detail,option);
	})
  });

  // Distruggi il grafico quando il componente viene smontato
  onDestroy(() => {
	if (chartInstance) {
        chartInstance.dispose();
      }
	// remove event listner for data changed
	const me = document.getElementById(containerId);
	me.removeEventListener("dataChanged", eventListener);
  });

  
  const initChart = (option:any) => {
  if (chartDom) {
    chartInstance = echarts.init(chartDom);
    chartInstance.setOption(option);
  } else {
    console.error("chartDom non è definito");
  }
};

const resizeChart = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };

  const updateChart = (node:any,option:any) => {
	if (chartInstance) {
		lossData=[];
		labels=[];
		lossData = trainingResults.map(res => res.error || 0);
		labels = trainingResults.map(res => res.iterations || 0)
		option.xAxis.data = labels;
		option.series[0].data = lossData;
		chartInstance.setOption(option);
	}
  }

 let option = {
  title: {
    text: 'Loss'
  },
  xAxis: {
    type: 'category',
    data: labels
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: lossData,
      type: 'line',
      smooth: true
    }
  ]
};

$: if(callbackNumber){
	console.log("echarts data changed")
	updateChart(null,option);
  }
</script>

<div class="echart-container" id="{containerId}" bind:this={chartDom} use:updateChart={option}></div>

