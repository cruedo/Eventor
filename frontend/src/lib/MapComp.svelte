<script>
    import { onMount } from 'svelte';
    import * as L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let { latitude = $bindable(), longitude = $bindable() } = $props()

    /** @type { any } */
    let mapDiv = $state();

    /** @type { any } */
    let map = $state();
    
    /** @type { any } */
    let marker = $state();
    
    onMount(() => {
        let view = [
            latitude ?? 51.490,
            longitude ?? -0.1274,
        ]
        
        map = L.map(mapDiv, {
            scrollWheelZoom: false,
        }).setView(view, 11);



        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        if(latitude !== null && longitude !== null) {
            marker = L.marker([+latitude, +longitude]).addTo(map)
        }

        map.on('contextmenu', onMapClick);
        //   map.on('click', onMapClick);
    });
  
    /** @param {any} e */
    function onMapClick(e) {
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;

        // Create or update the marker
        if (marker) {
            // If a marker already exists, update its position
            marker.setLatLng(e.latlng);
        } else {
            // If no marker exists yet, create a new one and add it to the map
            marker = L.marker(e.latlng).addTo(map);
        }
    }
</script>
  
<div bind:this={mapDiv} id="map" style="height: 500px;"></div>

<!-- {#if latitude !== null && longitude !== null}
    <p>Selected Location:</p>
    <p>Latitude: {latitude}</p>
    <p>Longitude: {longitude}</p>
{/if} -->

<style>
    #map {
    width: 100%;
    }
</style>