let form = document.querySelector(".main-form");
let selectD = document.getElementById("sResiduo");
let ejecicion = false;
let ilat = document.getElementById("lat");
let ilong = document.getElementById("long");
console.log


console.log(ilat);
console.log(ilong);
console.log(form);
console.log(selectD);

form.addEventListener('submit',(e)=>{
    e.preventDefault();
})

form.addEventListener('click',()=>{
    if(!ejecicion){
        selectD.insertAdjacentHTML('beforeend',`
            <option disabled selected>Tipo de Residuo</option>
            <option value="Microbasural">Microbasural</option>
            <option value="Macrobasural">Macrobasural</option>
            <option value="Basural Municipal">Basural Municipal</option>
        `);
        ejecicion = true;
    }
    obtenerUbicacion();
});

function obtenerUbicacion(){

    function success(position){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
    
        ilat.value = `${latitude}`;
        ilat.disabled = true;
        ilong.value = `${longitude}`;
        ilong.disabled = true;
}
    function error(){
        alert("Error al Obtener la ubicacion");
    }


    navigator.geolocation.getCurrentPosition(success,error);
}

