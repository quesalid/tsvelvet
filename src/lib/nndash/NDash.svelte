<script lang='ts'>
  import NetworkBuilder from './NetworkBuilder.svelte';
  import DataUploader from './DataUploader.svelte'
  import TrainingDashboard from './TrainingDashboard.svelte';
  import SaveModel from './SaveModel.svelte';
  import './nnstyle.css'
  let dataset:any = [];
  let net:any;
  let numInputs = 2;
</script>

<div class="nn-dash-class">
 
  <div>
	  <NetworkBuilder bind:net={net} bind:numInputs={numInputs}/>
	  <DataUploader bind:dataset={dataset} />
  </div>
  <div>
	  <TrainingDashboard bind:dataset={dataset} bind:net={net} bind:numInputs={numInputs}/>
	  <SaveModel bind:net={net} />
  </div>
</div>

<style>
</style>
