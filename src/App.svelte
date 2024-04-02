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
//import X6 from "./lib/x6editor/x6editor.svelte"


export let url = "/";



 onMount(async () => {  
     
 })

</script>

<Router>
  <div>
    <Route path="/graph" component={HOME}/>
    <Route path="/" component={EDITOR}/>
    <Route path="/df" component={DRAWFLOW}/>
    <Route path="/fd" component={KONVAFD}/>
    <Route path="/prp" component={KONVAPRP}/>
  </div>
</Router>

<style>
</style>