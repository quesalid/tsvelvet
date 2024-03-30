<script lang='ts'>
import {onMount} from 'svelte'
import { Stage, Layer, Shape, Line, Group, Rect, Image } from "svelte-konva"
    import App from '../../App.svelte';
   


const width = 400
const height = width*0.625
const n = 40
const delta = width/n
let stage:any
let piston:any
let vacuumpiston:any
let containerShape:any
let ductShape:any
let leftHeater:any
let rightHeater:any
let image = null;
let vialsFirstRow:any
let vialsSecondRow:any
let vialsFirstTray:any
let vialsSecondTray:any
let firstTray:any
let firstTrayHandle:any
let exhaustGas:any
let condenser:any
let condensercip:any
let condenserTank:any
let condenserTankShape:any
    
onMount(() => {
        const img = document.createElement("img");
        img.src = "Vial.png";
        img.onload = () => {
            image = img;
        };
    });

const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}

const shapeTank = (context,shape) =>{
    shape.id = 'TANK-001'
    const width = shape.width();
    const height = shape.height();
    // DRAW TANK
    context.beginPath();
    context.moveTo(4*delta, 8*delta);
    context.lineTo(4*delta, height - 4*delta);
    context.lineTo(18*delta, height - 4*delta);
    context.lineTo(18*delta, height - 8*delta);
    context.lineTo(22*delta, height - 8*delta);
    context.lineTo(23*delta, height - 5*delta);
    context.lineTo(37*delta, height - 5*delta);
    context.lineTo(38*delta, height - 6*delta);
    context.lineTo(38*delta, height - 14*delta);
    context.lineTo(37*delta, height - 15*delta);
    context.lineTo(23*delta, height - 15*delta);
    context.lineTo(22*delta, height - 12*delta);
    context.lineTo(18*delta, height - 12*delta);
    context.lineTo(18*delta, 8*delta);
    context.closePath();

    // (!) Konva specific method, it is very important
    context.fillStrokeShape(shape);
}

const shapeTankContext = {
    width:width,
    height:height,
    fill:'#FFFFFF',
    stroke:'#666666',
    strokeWidth:3
}
const shapeCondenserTank = (context,shape) =>{
    shape.id = 'TANK-001'
    const width = shape.width();
    const height = shape.height();
    // DRAW TANK
    context.beginPath();
    context.moveTo(22*delta, height - 8*delta);
    context.lineTo(23*delta, height - 5*delta);
    context.lineTo(37*delta, height - 5*delta);
    context.lineTo(38*delta, height - 6*delta);
    context.lineTo(38*delta, height - 14*delta);
    context.lineTo(37*delta, height - 15*delta);
    context.lineTo(23*delta, height - 15*delta);
    context.lineTo(22*delta, height - 12*delta);
    context.closePath();

    // (!) Konva specific method, it is very important
    context.fillStrokeShape(shape);
}

const shapeCondenserTankContext = {
    width:width,
    height:height,
    fill:'#FF0000',
    stroke:'#666666',
    strokeWidth:3,
    opacity:0.0,
}



const lineLeftSprinklerContext:any = {
    points:[4.5*delta, 8*delta, 4.5*delta, 18*delta, 4.5*delta+2, 18*delta,4.5*delta+2, 8*delta],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineLeftHeaterContext:any = {
    points:[6*delta, 11*delta, 6*delta, 21*delta, 6*delta+2, 21*delta,6*delta+2, 11*delta],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineRightSprinklerContext:any = {
    points:[17.5*delta, 8*delta, 17.5*delta, 18*delta, 17.5*delta+2, 18*delta,17.5*delta+2, 8*delta],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineRightHeaterContext:any = {
    points:[16*delta, 11*delta, 16*delta, 21*delta, 16*delta+2, 21*delta,16*delta+2, 11*delta],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineExhaustGasContext:any = {
    points:[37*delta, 19*delta, 37*delta+2, 19*delta, 37*delta+2, 10*delta,37*delta,10*delta,37*delta, 19*delta],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineCondenserContext:any = {
    points:[38*delta, 12*delta, 26*delta,12*delta,26*delta,18*delta,38*delta,18*delta,38*delta,18*delta-2, 26*delta+2,18*delta-2,26*delta+2,12*delta+2,38*delta,12*delta+2],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const lineCondenserCipContext:any = {
    points:[38*delta, 13*delta, 28*delta,13*delta,28*delta,13*delta+2,38*delta,13*delta+2],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const movePiston = (y:any,duration:any) =>{
    piston.to({y:y,duration:duration})
}

const moveFirstTray = (y:any,duration:any) =>{
    firstTray.to({y:y,duration:duration})
}

const moveFirstVial = (y:any,duration:any) =>{
    vialsFirstRow.to({y:y,duration:duration})
}

const moveVacuumPiston = (x:any,duration:any) =>{
    vacuumpiston.to({x:x,duration:duration})
}

const fhContainer = (fill:any,opacity:any,duration:any) =>{
    containerShape.to({fill:fill,opacity:opacity,duration:duration})
}
const fhHeater = (stroke:any,duration:any) =>{
    rightHeater.to({stroke:stroke,duration:duration})
    leftHeater.to({stroke:stroke,duration:duration})
}

const fhTray = (fill:any,duration:any) =>{
    vialsFirstTray.to({fill:fill,duration:duration})
    vialsSecondTray.to({fill:fill,duration:duration})
    firstTrayHandle.to({fill:fill,duration:duration})
}

const fhCondenser = (stroke:any,duration:any) =>{
    condenser.to({stroke:stroke,duration:duration})
}

const fhCondenserCip = (stroke:any,duration:any) =>{
    condensercip.to({stroke:stroke,duration:duration})
}

const fhCondenserTank =(fill:any,duration:any,opacity:any,visible=true)=>{
    condenserTank.to({visible:visible})
    condenserTankShape.to({fill:fill,duration:duration,opacity:opacity})
    
}

const load = async (duration) =>{
    firstTray.to({visible:true,duration:duration})
    vialsFirstRow.to({visible:true,duration:duration})
    vialsSecondRow.to({visible:true,duration:duration})
}

const unload = async (duration) =>{
    firstTray.to({visible:false,duration:duration})
    vialsFirstRow.to({visible:false,duration:duration})
    vialsSecondRow.to({visible:false,duration:duration})
    // SET VIALS TO START POSITION
    moveFirstTray(0,0.7)
    moveFirstVial(0,0.7)
}

const freezing = async () =>{
    fhHeater('blue',0.4)
    fhTray('blue',0.4)
    await sleep(600)
    fhContainer("blue",0.3,1.5)
    await sleep(2000)
    fhHeater('black',0.4)
    fhTray('#555555',0.4)
}

const primaryDrying = async () =>{
    moveVacuumPiston(delta,0.7)
    fhHeater('red',0.4)
    fhTray('red',0.4)
    fhCondenser('blue',0.4)
    await sleep(600)
    fhContainer("red",0.3,0.7)
    await sleep(2000)
    fhContainer("red",0.0,0.7)
    await sleep(2000)
    fhHeater('black',0.4)
    fhTray('#555555',0.4)
    fhCondenser('grey',0.4)
    await sleep(2000)
    moveVacuumPiston(0,0.7)
}

const sealing = async ()=>{
    movePiston(delta/2,0.7)
    await sleep(1000)
    movePiston(delta,0.7)
    moveFirstTray(delta/2,0.7)
    await sleep(1000)
    movePiston(delta*3/2,0.7)
    moveFirstTray(delta,0.7)
    moveFirstVial(delta/2,0.7)
    await sleep(1000)
    movePiston(0,0.7)
}

const defrost = async ()=>{
    fhCondenserCip("red",0.7)
    fhCondenserTank("red",0.7,0.2,true)
    await sleep(1000)
    fhCondenserTank("red",0.7,0.3,true)
    await sleep(1000)
    fhCondenserTank("red",0.7,0.2,true)
    await sleep(1000)
    fhCondenserCip("grey",0.7)
    fhCondenserTank("red",0.7,0.0,false)
}
const shapeClick = async (ev:any) =>{
    console.log("SHAPE CLICKED", ev.detail.target)
    const infoDiv = document.getElementById("id-freeze-dryer-info")
    infoDiv.innerHTML="LOAD"
    await load(0.7)
    await sleep(1000)
     infoDiv.innerHTML="FREEZING"
    await freezing()
    await sleep(1000)
     infoDiv.innerHTML="PRIMARY DRYING"
    await primaryDrying()
    await sleep(1000)
     infoDiv.innerHTML="SEALING"
    await sealing()
    await sleep(1000)
     infoDiv.innerHTML="UNLOAD"
    await unload(0.1)
    await sleep(1000)
     infoDiv.innerHTML="DEFROST"
    await defrost()
}
const shapeMouseEnter = (ev:any) =>{
    stage.container().style.cursor = 'pointer';
}
const shapeMouseLeave = (ev:any) =>{
    stage.container().style.cursor = 'default';
}
</script>
<div class="freeze-dryer-container">
<Stage config={{ width: window.innerWidth/2, height: window.innerHeight*2/3 }} bind:handle={stage}>
    <Layer>
        <Shape        
            config={{
                width: shapeTankContext.width,
                height: shapeTankContext.height,
                sceneFunc: shapeTank,
                fill: shapeTankContext.fill,
                stroke: shapeTankContext.stroke,
                strokeWidth: shapeTankContext.strokeWidth,
            }}
        />
        <Line
           config={lineLeftSprinklerContext}
        />
        <Line
           bind:handle={leftHeater}
           config={lineLeftHeaterContext}
        />
        <Line
           config={lineRightSprinklerContext}
        />
        <Line
           bind:handle={rightHeater}
           config={lineRightHeaterContext}
        />
        <Line
           bind:handle={exhaustGas}
           config={lineExhaustGasContext}
        />
        <Line
           bind:handle={condenser}
           config={lineCondenserContext}
        />
        <Line
           bind:handle={condensercip}
           config={lineCondenserCipContext}
        />
        <Group bind:handle={piston}>
            <Rect 
                config={
                    {x: 7*delta,y: 10*delta, width: 8*delta,height: 6,fill: "#555555"}
                }
            />
            <Rect 
                config={
                    {x: 9*delta,y: 10*delta - 6, width: 4*delta,height: 6,fill: "#555555"}
                }
            />
            <Rect 
                config={
                    {x: 10.5*delta,
                    y: 4*delta - 6, 
                    width: 1.5*delta,
                    height: 6*delta,
                    fillLinearGradientStartPoint: { x: 10*delta, y: 4*delta - 6 },
                    fillLinearGradientEndPoint: { x:  12*delta, y: 20*delta - 6 },
                    fillLinearGradientColorStops: [0,  "#DDDDDD", 1,  "#555555"]
                    }
                }
            />
        </Group>
         <Rect 
                config={
                    {x: 9*delta+5,y: 8*delta - 10, width: 10,height: 10,fill: "#999999",stroke:'#555555'}
                }
            />
         <Rect 
                config={
                    {x: 9*delta+30,y: 8*delta - 10, width: 10,height: 10,fill: "#999999",stroke:'#555555'}
                }
            />
        <Rect 
                config={
                    {x: 9*delta+4,y: 8*delta - 14, width: 37,height: 4,fill: "#555555"}
                }
            />
        <Rect 
                config={
                    {x: 10*delta,y: 8*delta - 5, width: 25,height: 5,fill: "#555555"}
                }
            />
        <Rect 
                config={
                    {x: 10*delta,y: 8*delta, width: 25,height: 5,fill: "#555555"}
                }
            />
        <Group bind:handle={vacuumpiston}>
            <Rect 
                config={
                    {x: 21.5*delta,y: 14.8*delta, width: 18*delta,height: 6,fill: "#DDDDDD"}
                }
            />
            <Rect 
                config={
                    {x: 21.5*delta+2,y: 14.8*delta-2, width: delta,height: 10,fill: "#555555"}
                }
            />
           <Line
                config={
                    {
                        points:[21.7*delta+5,13*delta,21.3*delta+5,14*delta,21.3*delta+5,16*delta,21.7*delta+5,17*delta ],
                        lineCap:'round',
                        lineJoin:'round',
                        stroke:'#555555',
                        strokeWidth:3
                    }
                }
           />
           <Line
                config={
                    {
                        points:[21.7*delta+5,13*delta,21.7*delta+5,17*delta ],
                        lineCap:'round',
                        lineJoin:'round',
                        stroke:'#555555',
                        strokeWidth:1
                    }
                }
           />
        </Group>
        <Rect 
                config={
                    {x: 38*delta-4,y: 15.5*delta - 14, width: 4,height: 20,fill: "#555555"}
                }
            />
        <Rect 
                config={
                    {x: 38*delta,y: 15.5*delta - 14, width: 4,height: 20,fill: "#555555"}
                }
        />

       
        <Shape  
            bind:handle={containerShape}
            config={{
                width: shapeTankContext.width,
                height: shapeTankContext.height,
                sceneFunc: shapeTank,
                fill: "blue",
                stroke: shapeTankContext.stroke,
                strokeWidth: shapeTankContext.strokeWidth,
                opacity:0.0
            }}
            on:click={shapeClick}
            on:mouseenter={shapeMouseEnter}
            on:mouseout= {shapeMouseLeave} 
        />
        <Group bind:handle={firstTray} config={{visible:false}}>
            <Rect   bind:handle={firstTrayHandle}
                    config={
                        {x: 7.5*delta,y: 11*delta, width: 70,height: 6,fill: "#555555"}
                    }
            />
        </Group>
        <Group bind:handle={vialsFirstRow} config={{visible:false}}>
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta,y:12*delta,}
            } />
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta +20,y:12*delta,}
            } />
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta +40,y:12*delta,
                }
            } />
            <Rect    bind:handle={vialsFirstTray}
                    config={
                        {x: 7.5*delta,y: 14*delta, width: 70,height: 6,fill: "#555555"}
                    }
            />
        </Group>
        <Group bind:handle={vialsSecondRow} config={{visible:false}}>
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta,y:15*delta,}
            } />
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta +20,y:15*delta,}
            } />
            <Image config={
                { image,scaleX: 0.5,scaleY: 0.5,x:8.5*delta +40,y:15*delta,
                }
            } />
            <Rect   bind:handle={vialsSecondTray}
                    config={
                        {x: 7.5*delta,y: 17*delta, width: 70,height: 6,fill: "#555555"}
                    }
            />
        </Group>
        <Group bind:handle={condenserTank} config={{visible:false}}>
            <Shape  bind:handle={condenserTankShape}      
            config={{
                width: shapeCondenserTankContext.width,
                height: shapeCondenserTankContext.height,
                sceneFunc: shapeCondenserTank,
                fill: shapeCondenserTankContext.fill,
                stroke: shapeCondenserTankContext.stroke,
                strokeWidth: shapeCondenserTankContext.strokeWidth,
                opacity: shapeCondenserTankContext.opacity
            }}
        />
        </Group>
    </Layer>
</Stage>
<div class="freeze-dryer-info" id="id-freeze-dryer-info">
second div
</div>
</div>

<style>
.freeze-dryer-container{
    display:flex;
}
</style>