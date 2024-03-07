<script lang="ts">
// VPN FOR DEPLOYNG
// https://www.softether.org/


import { Router, Route, navigate } from "svelte-routing";
import { onMount} from "svelte";
import HOME from "./routes/Home.svelte"
import EDITOR from "./lib/editor/Editor.svelte"


export let url = "/";



 onMount(async () => {  
     
 })

</script>

<Router url={url}>
  <div>
    <!--Route path="/" component={HOME}/-->
    <Route path="/" component={EDITOR}/>
  </div>
</Router>

<style>
</style>