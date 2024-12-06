<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let map;

  // Coordinate iniziali e livello di zoom
  const initialPosition = [41.9028, 12.4964]; // Roma, Italia
  const initialZoom = 5;

  // URL dell'API Ellipsis Drive per i dati di elevazione
  const elevationLayerUrl =
    'https://api.ellipsis-drive.com/v3/path/085f5e10-63b6-4e8f-a4c6-dce9689100d3/raster/timestamp/3179fa80-60ad-41c7-ae67-cdd5eeeca693/tile/{z}/{x}/{y}';

  // Parametri di stile da applicare al layer di elevazione
  const styleParams = {
        style:{
            method:"terrainRgb", 
            parameters:{
                alpha:1, 
                bandNumber:1,
                offset: 1.0,
            } 
        },
  };

  // Funzione per generare il URL con i parametri di stile
 const getStyledElevationLayerUrl = (url, params) => {
    // Copia l'oggetto per non mutare quello originale
    const queryParams = { ...params };
    
    // Converti il parametro annidato in JSON string
    if (queryParams.style) {
      queryParams.style = JSON.stringify(queryParams.style);
    }

    // Genera la query string
    const queryString = new URLSearchParams(queryParams).toString();
    console.log(`${url}?${queryString}`)
    return `${url}?${queryString}`;
  };

  // URL completo con i parametri di stile
  const styledElevationLayerUrl = getStyledElevationLayerUrl(
    elevationLayerUrl,
    styleParams
  );

  // Inizializzazione della mappa
  onMount(() => {
    // Crea la mappa
    map = L.map('map', {
      center: initialPosition,
      zoom: initialZoom,
      zoomControl: true,
    });

    // Aggiungi un layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Aggiungi il layer di elevazione con lo stile personalizzato
    L.tileLayer(styledElevationLayerUrl, {
      attribution: 'NASA Elevation Data via Ellipsis Drive',
      opacity: styleParams.opacity,
    }).addTo(map);
  });
</script>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>

<div id="map"></div>

