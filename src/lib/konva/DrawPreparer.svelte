<script lang='ts'>
import {onMount} from 'svelte'
import { Stage, Layer, Shape, Line, Group, Rect, Image } from "svelte-konva"
import SevenSegment from '../sevensegment/SevenSegment.svelte'
    import App from '../../App.svelte';

const width = 400
const height = width*0.625
const n = 40
const delta = width/n
let stage:any
let stirrer:any
let content:any
let heater:any
let outflow:any

const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}

const shapeTank = (context,shape) =>{
    shape.id = 'TANK-001'
    const width = shape.width();
    const height = shape.height();
    // DRAW TANK
    context.beginPath();
    context.moveTo(8*delta, 5*delta);
    context.lineTo(7*delta, 6*delta);
    context.lineTo(6*delta, 7*delta);
    context.lineTo(5*delta, 8.5*delta);
    context.lineTo(5*delta, 25*delta);
    context.lineTo(6*delta, 26.5*delta);
    context.lineTo(22*delta, 26.5*delta);
    context.lineTo(23*delta, 25*delta);
    context.lineTo(23*delta, 8.5*delta);
    context.lineTo(22*delta, 7*delta);
    context.lineTo(21*delta, 6*delta);
    context.lineTo(20*delta, 5*delta);
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

const stirrerContext:any = {
    points:[
    8*delta, 19*delta, 
    8*delta, 22*delta,
    20*delta,22*delta,
    20*delta,19*delta,
    20*delta+4,19*delta,
    20*delta+4,22*delta+4,
    8*delta-4,22*delta+4,
    8*delta-4,19*delta,
    8*delta, 19*delta,
    ],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const heaterContext:any = {
    points:[
    10*delta, 24*delta, 
    10*delta, 24*delta+5,
    23*delta, 24*delta+5,
    23*delta, 24*delta,
    10*delta, 24*delta,
    ],
    lineCap:'round',
    lineJoin:'round',
    stroke:'grey',
    strokeWidth:1
}

const fill = async (height:any,duration:any)=>{
    content.to({height:height,duration:duration})
    await sleep(1000)
}

const phcorrect = async (fill:any,duration:any)=>{
    content.to({fill:fill,duration:duration})
    await sleep(1000)
}

const empty = async (fill:any,duration:any)=>{
    content.to({height:0,duration:duration})
    outflow.to({fill:fill,duration:0.1})
    await sleep(1300)
    await outflow.to({fill:"#FFFFFF",duration:0.1})
}
const rotate = async (scaleX:any,duration:any,turns=4)=>{
    for(let i=0; i<turns;i++){
        stirrer.to({scaleX:scaleX,duration:duration,x:130})
        await sleep(1000*duration)
        stirrer.to({scaleX:1.0,duration:duration,x:0})
        await sleep(1000*duration)
    }
}

const heating = async (stroke:any,duration:any)=>{
    heater.to({stroke:stroke,duration:duration})
    await sleep(1000)
}

const shapeClick = async (ev:any) =>{
    console.log("SHAPE CLICKED", content.fill())
    content.fill("#AAAA00")
    await fill(-7*delta,0.7)
    await sleep(1000)
    await heating('red',0.7)
    await rotate(0.1,0.7)
    await fill(-12*delta,0.7)
    await sleep(1000)
    await rotate(0.1,0.4)
    await fill(-14*delta,0.7)
    await sleep(1000)
    await phcorrect("#AADD00",0.7)
    await rotate(0.1,0.2)
    await heating('grey',0.7)
    await empty("#AADD00",1.4)
}
</script>
<div class="freeze-dryer-container">
<Stage config={{ width: window.innerWidth/3, height: window.innerHeight*2/3 }} bind:handle={stage}>
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
            on:click={shapeClick}
        />
        <Rect 
                config={
                    {x: 12*delta+5,y: 4*delta, width: 40,height: 10,fill: "#999999",stroke:'#555555'}
                }
            />
         <Rect 
                config={
                    {x: 12*delta+5,y: 4*delta+10, width: 40,height: 10,fill: "#999999",stroke:'#555555'}
                }
            />
         <Rect 
                config={
                    {x: 13.5*delta,y: 2*delta-5, width: 20,height: 25,fill: "#999999",stroke:'#555555'}
                }
            />
        <Rect 
                config={
                    {x: 13*delta+10,y: 6*delta, width: 10,height: 160,fill: "#DDDDDD",stroke:'#555555'}
                }
            />
         <Rect 
                config={
                    {x: 14*delta,y: 22*delta, width: 10,height: 10,fill: "#999999",stroke:'#555555'}
                }
            />
         <Line bind:handle={heater}
                config={heaterContext}
           />
            <Rect bind:handle={outflow}
                config={
                    {x: 14*delta-5,y: 27*delta-5, width: 20,height: 20,fill: "#FFFFFF",stroke:'#555555'}
                }
            />
        <Group bind:handle={stirrer}>
            <Line
                config={stirrerContext}
           />
        </Group>
        <Group >
           <Rect  bind:handle={content}
                config={
                    {x: 5*delta,y: 26*delta, width: 18*delta,height: 0,fill: "#AAAA00",stroke:'#FFFFFF',opacity:0.3}
                }
            />
        </Group>
    </Layer>
</Stage>
    <div class="freeze-dryer-info">
        <div id="id-freeze-dryer-info-title">FASE:</div>
        <div class="freeze-dryer-measure">
            <div>Chamber Temp DEGC: </div>
            <!--SevenSegment bind:val={chamberTemp} svgname={svgname} eventName={"chamberTemp"}/-->
        </div>
         <div class="freeze-dryer-measure">
            <div>Chamber Press. bar: </div>
            <!--SevenSegment bind:val={chamberPress} svgname={svgname1} eventName={"chamberPress"}/-->
        </div>
    </div>
</div>

<style>
.freeze-dryer-container{
    display:flex;
}
.freeze-dryer-info{
    display:block;
}
#id-freeze-dryer-info-title{
    font-weight: 600 ;
}
.freeze-dryer-measure{
    display:flex;
    justify-content:space-between ;
    margin-left:auto;
}
</style>