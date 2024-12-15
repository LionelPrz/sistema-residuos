// Generacion del aside interactivo
let dropdowns = document.querySelectorAll('.dropdown-select');

dropdowns.forEach(dropdown => {
    let menuSelect = dropdown.nextElementSibling; // Obtenemos el menú asociado.
    let selects = menuSelect.querySelectorAll('li'); // Obtenemos los elementos de selección.

    dropdown.addEventListener('click', () => {
        // Toggle solo para el menú relacionado.
        dropdown.classList.toggle('dropdown-select-clicked');
        menuSelect.classList.toggle('dropdown-menu-open');
    });

    selects.forEach(select => {
        select.addEventListener('click', () => {
            console.log(select.innerText); // Accede al texto del elemento seleccionado.
            // Opcional: cierra el menú después de seleccionar.
            dropdown.classList.remove('dropdown-select-clicked');
            menuSelect.classList.remove('dropdown-menu-open');
        });
    });
});


// Generacion del Mapa
let map = L.map('map',{
    center: [45,-98],
    zoom: 8,
    minZoom: 3,
    maxZoom: 14,
    zoomComtrol: false
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.setView([51.505, -0.09],13);
