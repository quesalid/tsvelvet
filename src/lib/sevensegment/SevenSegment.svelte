<script lang="ts">
// https://www.codedrome.com/seven-segment-display-in-javascript/
import {onMount} from 'svelte'
import SevenSegmentDisplay from './SevenSegment.js'

let APP ={
        SSD: null,
        Counting: false,
        Interval: null
    }

export let svgname = "SVGSSD"
export let val = 1.25
export let scheme = 1
let chamberValueList:any
export let eventName = "chamberTemp"
onMount(() => {  
    console.log("SEVEN SEGMENT",APP)
    APP.SSD = new SevenSegmentDisplay(svgname)
    APP.SSD.Value = val
    APP.SSD.ColorScheme = scheme
    APP.SSD.NumberOfDigits = 5
    const svg = document.getElementById(svgname)
    chamberValueList = svg.addEventListener(eventName,(ev:any)=>{
        const val = ev.detail[eventName]
        console.log("RECEIVED",ev.detail)
        APP.SSD.Value = val
    })
 })
</script>
 <svg id="{svgname}"
        style="border: 0px solid; left: 8px; top:8px;"
        height="30"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
    </svg>
<style>
</style>