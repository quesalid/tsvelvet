<script lang='ts'>
import {onMount} from "svelte"
  import LossChart from './LossChart.svelte';
  import './nnstyle.css'
    import App from "../../App.svelte";
  export let dataset = [];
  export let net:any;
  export let numInputs:any
  let trainingResults = [];
  let trainingData = [];
  let iterations = 10000;
  let callbackNumber = 0;
  let containerId = "echart-container-id";
  
  onMount(() => {
	console.log("Training Dashboard mounted");
   const rows = dataset.map((row:any) => Object.values(row));
      const mins = [];
      const maxs = [];

      for (let col = 0; col <= numInputs; col++) {
        const columnValues:any = rows.map(row => row[col]);
        mins[col] = Math.min(...columnValues);
        maxs[col] = Math.max(...columnValues);
    }
    trainingData = rows.map(row => {
        const input = row.slice(0, numInputs).map((val, idx) => normalize(val, mins[idx], maxs[idx]));
        // assign the output to the remaining value of the row
        const output = row.slice(numInputs).map((val, idx) => normalize(val, mins[idx], maxs[idx]))
        //const output = [normalize(row[numInputs], mins[numInputs], maxs[numInputs])];
        return { input, output };
    });
  });
 

  

  const trainNetwork = () => {
      try{ 
            if(trainingData.length > 0){
                callbackNumber = 0;
                const formattedData = trainingData
                console.log("Training the network",formattedData)
                if(net)
                    net.train(formattedData, {
                      log: false,
                      logPeriod: 100,
                      iterations: iterations,
                      learningRate: 0.001,
                      errorThresh: 0.001,
                      callback: (details:any) => {trainingResults.push(details);sendDataChanged()},
                      callbackPeriod:100,
                    });
                else{
                    console.log("Network not defined")
                    alert("Network not defined")
                }
            }else{
			  console.log("No data to train");
              alert("No data to train");
			}
      }catch(e){
		  console.log(e);
	  }
  };

  const resetTraining = () => {
	trainingResults = [];
	sendDataChanged();
  };

  // Funzione per normalizzare i valori tra 0 e 1
function normalize(value, min, max) {
  return (value - min) / (max - min);
}

// Funzione per denormalizzare i valori (utile per interpretare l'output)
function denormalize(value, min, max) {
  return value * (max - min) + min;
}

 $: if(dataset){
     console.log("Dataset changed",dataset,net)
     // dataset is a json array: map it to the format expected by brain.js
     const rows = dataset.map((row:any) => Object.values(row));
      const mins = [];
      const maxs = [];

      for (let col = 0; col <= numInputs; col++) {
        const columnValues:any = rows.map(row => row[col]);
        mins[col] = Math.min(...columnValues);
        maxs[col] = Math.max(...columnValues);
    }
    trainingData = rows.map(row => {
        const input = row.slice(0, numInputs).map((val, idx) => normalize(val, mins[idx], maxs[idx]));
        const output = [normalize(row[numInputs], mins[numInputs], maxs[numInputs])];
        return { input, output };
    });
 }

 const sendDataChanged = () => {
	 // send custom event to LossChart
     const me = document.getElementById(containerId);
     me.dispatchEvent(new CustomEvent("dataChanged", {detail: trainingResults}));
 }
</script>

<div class="neural-training-class">
  <h2>C. Training Dashboard</h2>
    <div>
        <button on:click={trainNetwork}>Start Training</button>
        <label>Num. of Iteration:</label>
        <input type="number" min="1" bind:value={iterations} />
        <button on:click={resetTraining}>Reset</button>
    </div>
  <LossChart bind:trainingResults={trainingResults} bind:callbackNumber={callbackNumber}/>
</div>

