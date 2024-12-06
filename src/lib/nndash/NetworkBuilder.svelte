<script>
  import { NeuralNetwork, NeuralNetworkGPU, recurrent,AE, FeedForward, Recurrent} from 'brain.js';

  import './nnstyle.css'
   // Estrarre i modelli RNN, LSTM e GRU
  const { RNN, LSTM, GRU,  } = recurrent;


  let networkType = 'NeuralNetwork';
  export let numInputs = 2;
  let numOutputs = 1;
  let hiddenLayers = [{ neurons: 3 }]; // Array per gestire i layer nascosti
  export let net;
  let networkCreated = false;

   // Parametri aggiuntivi per RNN, LSTM, GRU
  let iterations = 2000;
  let learningRate = 0.01;

  // Aggiungi un nuovo hidden layer
  const addHiddenLayer = () => {
    hiddenLayers = [...hiddenLayers, { neurons: 3 }];
  };

  // Rimuovi un hidden layer specifico
  const removeHiddenLayer = (index) => {
    hiddenLayers = hiddenLayers.filter((_, i) => i !== index);
  };

  // Funzione per creare la rete neurale
  const createNetwork = () => {
    const hiddenLayerSizes = hiddenLayers.map(layer => layer.neurons);

    const options = {
      inputSize: numInputs,
      hiddenLayers: hiddenLayerSizes,
      outputSize: numOutputs,
      iterations,
      learningRate
    };

    switch (networkType) {
      case 'NeuralNetwork':
        net = new NeuralNetwork(options);
        break;
      case 'NeuralNetworkGPU':
        net = new NeuralNetworkGPU(options);
        break;
      case 'RNN':
        net = new RNN(options);
        break;
      case 'LSTM':
        net = new LSTM(options);
        break;
      case 'GRU':
        net = new GRU(options);
        break;
        case 'AutoEncoder':
        net = new NeuralNetwork({
          inputSize: numInputs,
          hiddenLayers: hiddenLayerSizes,
          outputSize: numInputs, // output uguale agli input per AutoEncoder
        });
        break;
      default:
        net = new NeuralNetwork(options);
    }

    networkCreated = true;
  };

  // Funzione per ottenere l'array di configurazione della rete
  const getNetworkConfiguration = () => {
   
    return [
      numInputs,
      ...hiddenLayers.map(layer => layer.neurons),
      numOutputs
    ];
  };
</script>



<div class="network-definition-class">
  <h2>A. Neural Network Builder</h2>

  <!-- Selezione del tipo di rete -->
  <div class="network-definition-item">
      <label>Network Type:</label>
       <select bind:value={networkType}>
        <option value="NeuralNetwork">Feedforward Neural Network</option>
        <option value="NeuralNetworkGPU">Feedforward Neural Network (GPU Optimized)</option>
        <option value="RNN">Recurrent Neural Network (RNN)</option>
        <option value="LSTM">Long Short-Term Memory (LSTM)</option>
        <option value="GRU">Gated Recurrent Unit (GRU)</option>
        <option value="AutoEncoder">AutoEncoder</option>
      </select>
  </div>

  <!-- Input per il numero di input, hidden layers e output -->
  <div class="network-definition-item">
    <label>Number of Inputs:</label>
    <input type="number" min="1" bind:value={numInputs} />
  </div>

  <div class="network-definition-item">
    <label>Number of Outputs:</label>
    <input type="number" min="1" bind:value={numOutputs} />
  </div>

  <div class="network-definition-layers">
      <h3>Hidden Layers</h3>

      {#each hiddenLayers as layer, index}
        <div  class="network-definition-item">
          <label>Layer {index + 1} Neurons:</label>
          <div>
              <input type="number" min="1" bind:value={layer.neurons} />
              <button on:click={() => removeHiddenLayer(index)}>Remove</button>
          </div>
        </div>
      {/each}

      <button on:click={addHiddenLayer}>Add Hidden Layer</button>

      <!-- Opzioni avanzate per RNN/LSTM/GRU -->
      {#if networkType !== 'NeuralNetwork' && networkType !== 'NeuralNetworkGPU'}
        <h3>Advanced Settings</h3>
        <div>
          <label>Iterations:</label>
          <input type="number" min="1" bind:value={iterations} />
        </div>
        <div>
          <label>Learning Rate:</label>
          <input type="number" min="0.001" max="1" step="0.001" bind:value={learningRate} />
        </div>
      {/if}
  </div>
 
  <div class="network-definition-item">
  <!-- Creazione della rete -->
  <button on:click={createNetwork}>Create Network</button>
  </div>

  {#if networkCreated}
    <div class="network-created">
      <h2>Network Created Successfully!</h2>
      <!-- Visualizza l'array di configurazione della rete -->
      <pre>Network: {JSON.stringify(getNetworkConfiguration())}</pre>
      <div style="visibility:hidden;">{networkCreated=false}</div>
    </div>
  {/if}
</div>
<style>
.network-definition-item{
  display: flex;
  justify-content: space-between;
}
.network-definition-layers{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
