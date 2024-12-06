<script>
  import { onMount } from 'svelte';
  import * as Cesium from 'cesium';
  import '../../../node_modules/cesium/Build/Cesium/Widgets/widgets.css';

  const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_TOKEN;
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTk5NTRiMi00NTc0LTQ5M2EtYjAxNy0wZTNjMDViNGEwNTAiLCJpZCI6MjU0Nzk3LCJpYXQiOjE3MzE0NDQyMzR9.Q7hVel0FnRqHYZDVqFeSfqJgOdjxDfv88h1IuN_UXiY';

  let viewer;

  onMount(async () => {
    viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: await Cesium.createWorldTerrainAsync(),
    });
  });
</script>

<div id="cesiumContainer"></div>