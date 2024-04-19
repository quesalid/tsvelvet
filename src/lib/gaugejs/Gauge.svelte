<script lang='ts'>
// http://bernii.github.io/gauge.js/#!
import * as GJS from './gauge.js'
import { onMount, onDestroy } from 'svelte';

export let gauge:any

export let opts = {
          angle: -0.2, // The span of the gauge arc
          lineWidth: 0.2, // The line thickness
          radiusScale: 0.8, // Relative radius
          pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
          },
          limitMax: false,     // If false, max value increases automatically if value > maxValue
          limitMin: false,     // If true, the min value of the gauge will be fixed
          //colorStart: '#6FADCF',   // Colors
          colorStart: '#6FADCF',   // Colors
          colorStop: '#8FC0FA',    // just experiment with them
          strokeColor: '#E0E0E0',  // to see which ones work best for you
          generateGradient: true,
          highDpiSupport: true,     // High resolution support
          staticLabels: {
              font: "8px sans-serif",  // Specifies font
              labels: [0, 50, 100, 150, 200, 250,300],  // Print labels at these values
              color: "#000000",  // Optional: Label text color
              fractionDigits: 0  // Optional: Numerical precision. 0=round off.
            },
        staticZones: [
           {strokeStyle: "#F03E3E", min: 0, max: 60}, // Red from 100 to 130
           {strokeStyle: "#FFDD00", min: 60, max: 120}, // Yellow
           {strokeStyle: "#30B32D", min: 120, max: 180}, // Green
           {strokeStyle: "#FFDD00", min: 180, max: 240}, // Yellow
           {strokeStyle: "#F03E3E", min: 240, max: 300}  // Red
        ],
        renderTicks: {
          divisions: 5,
          divWidth: 1.1,
          divLength: 0.7,
          divColor: '#333333',
          subDivisions: 3,
          subLength: 0.5,
          subWidth: 0.6,
          subColor: '#666666'
        }
    };

export let width = '150'
export let height = '100'
const myCanvasName = 'myCanvasName'

onMount(async () => {
    var target = document.getElementById(myCanvasName); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 300; // set max gauge value
    gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(125); // set actual value
   
})




</script>

 <canvas class="gaugecanvas" id="{myCanvasName}" width="{width}" height="{height}"></canvas>



<style>
.gaugecanvas{
    width: 150px;
    height: 100px;
}
</style>