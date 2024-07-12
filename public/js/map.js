
  mapboxgl.accessToken ='pk.eyJ1IjoiYWtzaGFkMzY5IiwiYSI6ImNseWRhZWw0MjA0N2QybHBkMXdmamNoNHAifQ.rGQx6eAVdQQoRrDycKV5lA';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",
        center: [77.1025, 28.7041], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom 
    });


    // console.log(coordinates);
    // const marker1 = new mapboxgl.Marker()
    // .setLngLat([12.554729, 55.70651])
    // .addTo(map)
