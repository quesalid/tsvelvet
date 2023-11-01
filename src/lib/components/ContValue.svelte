<script lang="ts">
// https://math.stackexchange.com/questions/1332879/conditional-probability-combining-discrete-and-continous-random-variables

import {onMount} from "svelte"
import {Mixture} from "./GraphUtils"

//export let value : any
export let node: any
export let graph: any = {nodes:[],edges:[]}
export let  width = 80;
export let  height = 40;

let gauss:any
let ctx:any
let cvs:any
let mean = 0
let variance = 1
let means = [0,0.5]
let variances = [1,1]
let weigths = [0.5,0.5]
let mixture:any

onMount(async()=>{
		const element = document.getElementById('NWC-'+node.id+'-'+node.label)
		if(element){
			element.addEventListener('changevalue',evHandler)
		}
		cvs = document.querySelector("#cont-canvas"+node.label);
		ctx = cvs.getContext("2d");
        //gauss = new Gaussian(mean,variance);
        await sleep(50)
        mixture = new Mixture(means,variances,weigths);
        mixture.setLimits(-20,20)
        mixture.setNorm(node.data[0].distribution.length/node.data[0].status.length)
        /*const p0 = mixture.getProbability(19)
        console.log("PROBABILITY p0: ",p0,mixture.norm)*/
		showStd()
})

const  showStd = () => {
  //gauss.draw(ctx);
  mixture.draw(ctx,cvs,width,height);
}

const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}

const evHandler = async(ev:any)=>{
        let mv = ev.detail.mv
        await sleep(50)
        mixture = new Mixture(mv.means,mv.variances,mv.weights);
        mixture.setLimits(-20,20)
        mixture.setNorm(node.data[0].distribution.length/node.data[0].status.length)
        /*const p0 = mixture.getProbability(19)
        console.log("PROBABILITY p0: ",p0,mv)*/
        showStd()
	}


/*var Gaussian = function(mean, std) {
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
};*/

export let distDefClicked:any

</script>
     <div class="bayes-node-cont-value" id="{'NWC-'+node.id+'-'+node.label}" data-node="{'N-'+node.id}">
		<canvas id={"cont-canvas"+node.label} width={width} height={height} data-node="{'N-'+node.id}" on:click={distDefClicked}></canvas>
	</div>
<style>

.bayes-node-cont-value{
    margin-left: 10px;
    cursor: pointer;
}
.bayes-node-cont-value canvas{
    border: solid 1px;
}
.bayes-node-cont-value canvas:hover{
    background: #F9F9F9;
}
</style>