let form = document.querySelector(".formulario");
let selectD = document.getElementById("residuo");
let ejecicion = false;
let ilat = document.getElementById("lat");
let ilong = document.getElementById("long");
let inputs = document.querySelectorAll('#formulario input,select,textarea');

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    dni: /^\d{8}$/, //8 numeros.
    texto: /^[a-zA-ZÀ-ÿ0-9\s.,;!?(){}[\]'"-]{1,250}$/,  // Permite letras, números, espacios y signos de puntuación
    residuo: /^(Microbasural|Macrobasural|Basural Municipal)$/, // Tres valores posibles.
    latitud: /^-?([1-8]?[0-9](\.\d{1,6})?|90(\.0{1,6})?)$/,  // Latitud entre -90 y 90, hasta 6 decimales
    longitud: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d{1,6})?|180(\.0{1,6})?)$/,  // Longitud entre -180 y 180, hasta 6 decimales
}

const campos = {
    nombre: false,
    apellido: false,
    dni: false,
    texto: false,
    latitud:false,
    longitud:false,
    residuo:false,
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    console.log(campos);

    if(campos.nombre && campos.apellido && campos.dni && campos.texto && campos.latitud && campos.longitud && campos.residuo){

        form.reset();
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 5000);

		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
	} 
    else {
		document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
	    }
    }
)

inputs.forEach((input)=>{
    input.addEventListener('keyup',validarFormulario);
    input.addEventListener('blur',validarFormulario);
    input.addEventListener('change',validarFormulario);
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
        // ilat.disabled = true;
        ilong.value = `${longitude}`;
        // ilong.disabled = true;
}
    function error(){
        alert("Error al Obtener la ubicacion");
    }
    navigator.geolocation.getCurrentPosition(success,error);
}

function validarFormulario(e){

    switch(e.target.name){
        case "nombre":
            validarCampo(expresiones.nombre,e.target,'nombre');
        break;
        case "apellido":
            validarCampo(expresiones.apellido,e.target,'apellido');
        break;
        case "dni":
            validarCampo(expresiones.dni,e.target,'dni');
        break;
        case "texto":
            validarCampo(expresiones.texto,e.target,'texto');
        break;
        case "latitud":
            validarCampo(expresiones.latitud,e.target,'latitud');
        break;
        case "longitud":
            validarCampo(expresiones.longitud,e.target,'longitud');
        break;
        case "residuo":
            validarCampo(expresiones.residuo,e.target,'residuo');
    }
}

function validarCampo(expresion,input,campo){
    if(expresion.test(input.value)){
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
    }
    else{
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
    }
}