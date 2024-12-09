<script lang="ts">
// VPN FOR DEPLOYNG
// https://www.softether.org/


import { Router, Route, navigate } from "svelte-routing";
import { onMount} from "svelte";
import HOME from "./routes/Home.svelte"
import EDITOR from "./lib/editor/Editor.svelte"
import DRAWFLOW from './lib/drawflow/editor.svelte'
import KONVAFD from './lib/konva/DrawFreezeDryer.svelte'
import KONVAPRP from './lib/konva/DrawPreparer.svelte'
//import GAUGE from './lib/gaugejs/Gauge.svelte'
import CHATBOT from './lib/chatbot/ChatBot.svelte'
import SVELTEFLOW from './lib/svelteflow/Editor.svelte'
import CLAUDECONFIG from './lib/dashconfig/DashboardConfigurator.svelte'
//import D3 from './lib/d3/D3.svelte'
import D3LEAF from './lib/d3/D3Leaflet.svelte'
//import D3LIBRE from './lib/d3/D3Libre.svelte'
import D3TLIBRE from './lib/d3/D3TLibre.svelte'
import SVGCHART from './lib/echartsvg/EchartSvg.svelte'
import NDASH from './lib/nndash/NDash.svelte'
import SYSDYNDASH from "./lib/sdyn/SysDynDash.svelte"
import VREC from './lib/vrec/Vrec.svelte'
import ASSET from './lib/asset/AssetComp.svelte'
//import POWER from './lib/pwr/PowerLine.svelte'
import ASSETCHART from './lib/asset/AssetChart.svelte'
import SAGGRID from './lib/asset/SagGrid.svelte'
import TESTSIMPLE from './lib/table/TestSimpleTable.svelte'


export let url = "/";



 onMount(async () => {  
     
 })

</script>

<Router>
  <div>
    <Route path="/ed" component={EDITOR}/>
    <Route path="/graph" component={HOME}/>
    <Route path="/df" component={DRAWFLOW}/>
    <Route path="/fd" component={KONVAFD}/>
    <Route path="/prp" component={KONVAPRP}/>
    <!--Route path="/gjs" component={GAUGE}/-->
    <Route path="/" component={CHATBOT}/>
    <Route path="/sf" component={SVELTEFLOW}/>
    <Route path="/cdc" component={CLAUDECONFIG}/>
    <!--Route path="/d3" component={D3}/-->
    <Route path="/d3l" component={D3LEAF}/>
    <!--Route path="/d3lbr" component={D3LIBRE}/-->
    <Route path="/d3tlbr" component={D3TLIBRE}/>
    <Route path="/ecsvg" component={SVGCHART}/>
    <Route path="/ndash" component={NDASH}/>
    <Route path="/sdash" component={SYSDYNDASH}/>
    <Route path="/vrec" component={VREC}/>
    <Route path="/asset" component={ASSET}/>
    <!--Route path="/power" component={POWER}/-->
    <Route path="/achart" component={ASSETCHART}/>
    <Route path="/sag" component={SAGGRID}/>
    <Route path="/tests" component={TESTSIMPLE}/>
  </div>
</Router>

<style>
</style>