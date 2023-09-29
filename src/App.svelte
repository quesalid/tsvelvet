<script lang="ts">
// VPN FOR DEPLOYNG
// https://www.softether.org/


import { Router, Route, navigate } from "svelte-routing";
import { onMount} from "svelte";
import HOME from "./routes/Home.svelte"


export let url = "/";



 onMount(async () => {  
     
 })

</script>

<Router url={url}>
  <div>
    <Route path="/" component={HOME}/>
  </div>
</Router>

<style>
</style>