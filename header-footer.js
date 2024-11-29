// variables para el dark mode
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('switch');
const themeText = document.querySelector('.header-dark-theme p'); // Elemento de texto del modo

// Variables para seccion clima
let temperatura = document.getElementById('temperature');
let ubicacion = document.getElementById('location');
let descripcion = document.getElementById('description');
let image = document.getElementById('image');
let lon = -58.65306;
let lat =  -28.751389;
let key = '9588893d32e1c6900e83cbb514ec110c';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=es&units=metric`

// variables para links en el footer
let footerLink = document.querySelectorAll('#redes-cont > button');

// Funcion para tener la aplicacion de clima en la app
window.addEventListener('load',()=>{

      fetch(url)
        .then(response =>{return response.json()})
        .then(data =>{

          let temp = Math.round(data.main.temp);
              temperatura.textContent = `${temp} ° C`;
          let desc = data.weather[0].description;
              descripcion.textContent = desc.toUpperCase();
              // ubicacion.textContent = data.name;
          
          // Iconos animados
          switch(data.weather[0].main){
            case 'Clear':
              image.src = './svg-assets/day.svg'
              console.log('limpio');
              break;
            case 'Clouds':
              image.src = './svg-assets/cloudy-day-1.svg'
              console.log('nubes');
              break;
            case 'Rain':
              image.src = './svg-assets/rainy-7.svg'
              console.log('lluvia');
              break;
            case 'Drizzle':
              image.src = './svg-assets/rainy-2svg'
              console.log('llovizna');
              break;
            case 'Snow':
              image.src = './svg-assets/snowy-6svg'
              console.log('nieve');
              break;
            case 'Thunderstorm':
              image.src = './svg-assets/thunder.svg'
              console.log('tormenta');
              break;
            case 'Atmosphere':
              image.src = './svg-assets/weather.svg'
              console.log('atmosfera');
              break;
            default:
              image.src = './svg-assets/cloudy-day-1.svg'
              console.log('defercto');
              break;
          }
        })
        .catch(error =>{
          console.log(error);
        })
    });

    footerLink.forEach((button)=>{
      button.addEventListener('click',agregarLink);
    })

function agregarLink(){
  const links = {
    facebook: `https://es-la.facebook.com/`,
    instagram: `https://www.instagram.com/`,
    whatsapp: `https://web.whatsapp.com/`
  }
  for (let i = 0; i <= links.length; i++) {
    
  }

}

// Modo oscuro usando local storage

// Función para activar el modo oscuro
const enableDarkmode = () => {
document.body.classList.add('darkmode');
themeText.textContent = "Modo Claro"; // Cambia el texto a "Modo Claro"
themeSwitch.checked = true; // Marca el toggle
localStorage.setItem('darkmode', 'active');
}

// Función para desactivar el modo oscuro
const disableDarkmode = () => {
document.body.classList.remove('darkmode');
themeText.textContent = "Modo Oscuro"; // Cambia el texto a "Modo Oscuro"
themeSwitch.checked = false; // Desmarca el toggle
localStorage.setItem('darkmode', null);
}

// Verifica el estado de darkmode al cargar la página
if (darkmode === "active") enableDarkmode();

// Evento de cambio en el toggle para cambiar el tema
themeSwitch.addEventListener("change", () => {
darkmode = localStorage.getItem('darkmode');
darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});
