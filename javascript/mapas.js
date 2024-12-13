let map = L.map('map',{
    center: [45,-98],
    zoom: 8,
    minZoom: 3,
    maxZoom: 14,
    zoomComtrol: false
});

map.setView([51.505, -0.09],13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);