<script lang="ts">
// https://math.stackexchange.com/questions/1332879/conditional-probability-combining-discrete-and-continous-random-variables

import {onMount} from "svelte"
import {updateAllDValues,getAllCheckedStatus} from './GraphUtils'

//export let value : any
export let node: any
export let graph: any = {nodes:[],edges:[]}
export let  width = 40;
export let  height = 40;

let gauss:any
let ctx:any
let cvs:any
let mean = 0
let variance = 1

onMount(()=>{
		const element = document.getElementById('NWC-'+node.id+'-'+node.label)
		if(element){
			element.addEventListener('changevalue',evHandler)
		}
		cvs = document.querySelector("#cont-canvas"+node.label);
		ctx = cvs.getContext("2d");
        gauss = new Gaussian(mean,variance);
		showStd()
})

const  showStd = () => {
  gauss.draw(ctx);
}

const evHandler = async(ev:any)=>{
        if(ev.detail.mean && !isNaN(Number(ev.detail.mean)))
            mean = Number(ev.detail.mean)
		if(ev.detail.variance && !isNaN(Number(ev.detail.variance)))
			variance =  ev.detail.variance
		gauss = new Gaussian(mean,variance);
        showStd()
	}

	
var Gaussian = function(mean, std) {
  this.mean = mean;
  this.std = std;
  this.a = 1/Math.sqrt(2*Math.PI);
};

Gaussian.prototype = {
  addStd: function(v) {
    this.std += v;
  },
  
  get: function(x) {
    var f = this.a / this.std;
    var p = -1/2;
    var c = (x-this.mean)/this.std;
    c *= c;
    p *= c;
    return f * Math.pow(Math.E, p);
  },

  generateValues: function(start, end) {
    var LUT = [];
    var step = (Math.abs(start)+Math.abs(end)) / 100;
    for(var i=start; i<end; i+=step) {
      LUT.push(this.get(i));
    }
    return LUT;
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    var points = this.generateValues(-10,10);
    var len = points.length;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    var p0 = points[0];
    ctx.moveTo(0, height - (height*p0));
    points.forEach(function(p,i) {
      if(i===0) {
        return;
      }
      ctx.lineTo(width * i/len, height - (height*p));
      p0 = p;
    });
    ctx.stroke();
  }
};

</script>
     <div class="bayes-node-cont-value" id="{'NWC-'+node.id+'-'+node.label}" data-node={node.label}>
		<canvas id={"cont-canvas"+node.label} width={width} height={height}></canvas>
	</div>
<style>

.bayes-node-cont-value{
    margin-left: 10px;
    padding-bottom: 20px;
}
</style>