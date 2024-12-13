let form = document.querySelector(".formulario");
let selectD = document.getElementById("residuo");
let ejecicion = false;
let ilat = document.getElementById("lat");
let ilong = document.getElementById("long");
let inputs = document.querySelectorAll('#formulario input,select,textarea');
let btnAlert = document.getElementById('btn-submit');
let alertInfo = false;

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    dni: /^\d{8}$/, //8 numeros.
    texto: /^[a-zA-ZÀ-ÿ0-9\s.,;!?(){}[\]'"-]{1,250}$/,  // Permite letras, números, espacios y signos de puntuación
    residuo: /^(Microbasural|Macrobasural|Basural Municipal)$/, // Tres valores posibles.
    latitud: /^-?([1-8]?[0-9](\.\d{1,10})?|90(\.0{1,10})?)$/,  // Latitud entre -90 y 90, hasta 6 decimales
    longitud: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d{1,8})?|180(\.0{1,6})?)$/,  // Longitud entre -180 y 180, hasta 6 decimales
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

    if(campos.nombre && campos.apellido && campos.dni && campos.texto && campos.latitud && campos.longitud && campos.residuo){
		setTimeout(() => {
            generateAlert("info");
            resetInput();
            form.reset();
		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                icono.classList.remove('formulario__grupo-correcto');
            });
        }, 5000);
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

});

// Validaciones y Solicitud de latitud y longitud

ilat.addEventListener('click',obtenerUbicacion);
ilong.addEventListener('click',obtenerUbicacion);


function obtenerUbicacion(){

    if(!alertInfo){
        navigator.permissions.query({name:'geolocation'})
        .then(function(result){
            if(result.state === 'granted'){
                navigator.geolocation.getCurrentPosition(success,error);
                alertInfo = true;
            }
            else if(result.state === 'prompt'){
                info();
                navigator.geolocation.getCurrentPosition(success,error);
                alertInfo = false;
            }
            else if(result.state === 'denied'){
                error(error);
                alertInfo = false;
            }
        });
    
    function info(){
        generateAlert("info", "Necesitamos acceder a tu ubicacion para completar el formulario. Por favor, permita el acceso !");
    }

    function success(position){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
    
            ilat.value = `${latitude}`;
            validarCampo(expresiones.latitud, ilat, 'latitud');

            ilong.value = `${longitude}`;
            validarCampo(expresiones.longitud, ilong, 'longitud');
            // Validacion y posterior desactivacion de los valores latitud y longitud
            disableInput();
                generateAlert("success","Ubicacion obtenida con exito");
    }
}

    function error(error){
        let msg = "";
        switch(error.code){
            case error.PERMISSION_DENIED:
                msg = "No se permitio el acceso a la ubicacion. Active los permisos para continuar !";
                break;
            case error.POSITION_UNAVAILABLE:
                msg = "No se pudo obtener su ubicacion. Por favor intente nuevamente !";
                break;
            case error.TIMEOUT:
                msg = "La solicitud de ubicacion tardo demasiado. Intentelo nuevamente !";
                break;
            default:
                msg = "Ocurrio un error inesperado al obtener su ubicacion.";
        }
            generateAlert("error", msg);
    }
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
        case "residuo":
            validarCampo(expresiones.residuo,e.target,'residuo');
        break;
    }
    // Ocultar mensaje de advertencia si todos los campos son válidos
    if (Object.values(campos).every((campo) => campo)) {
        document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
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

function disableInput(){
    ilat.readOnly = true;
    ilong.readOnly= true;
}

function resetInput(){
    ilat.value = "";
    ilong.value = "";    
    ilat.readOnly = false;
    ilong.readOnly= false;
}

function generateAlert(resultado, mensaje = null){

    // Validacion precencia para evitar duplicados
    if(document.getElementById("customAlert")) return;

    // declaracion de variables
    let texto;
    let imagen;
    let claseCont = "custom-alert";
    let claseText = "alert-text";
    let clasePbar = "alert-progress-bar"
    let claseBar = "bar-content";

    // Comprobacion de resultado

    switch(resultado){

        case "error":
            // Generacion del alert de error
            imagen ="./svg-assets/ayuyu-angry-png.png";
            texto = mensaje || "Se produjo un error al enviar el formulario !";
            claseText = "alert-text-error";
            clasePbar = "alert-progress-bar  red1";
            claseBar = "bar-content red";
            claseCont += " custom-alert-error";
            break;
        
        case "success":
            // Generacion del alert de exito
            imagen ="./svg-assets/boochi-nato-png.png";
            texto = mensaje || "Formulario enviado Correctamente";
            claseCont += " custom-alert-success";
            clasePbar = "alert-progress-bar green1"
            claseBar = "bar-content green";
            break;
        
        case "info":
            // Generacion del alert de informacion
            imagen ="./svg-assets/boochi-nato-png.png";
            claseText = "alert-text-info";
            texto = mensaje || "Por favor permita el acceso a su ubicacion !";
            claseCont += " custom-alert-info";
            clasePbar = "alert-progress-bar blue1"
            claseBar = "bar-content blue";
            break;
    }

            // Generar el elemento de manera dinamica y insertarlo despues del boton
            btnAlert.insertAdjacentHTML('afterend',`
                <div id="customAlert" class="alert-overlay">
                    <div class="${claseCont}">
                    <div class="${clasePbar}">
                    <span class="${claseBar}"></span>
                </div>
                    <img src="${imagen}" class="alert-img" alt="imagen mamalona">
                    <p class="${claseText}">${texto}</p>
                </div>
            </div>
            `);

        const idCont = document.getElementById("customAlert");

                idCont.addEventListener('click',(e)=>{
                e.stopPropagation();
            });
            setTimeout(()=>{
                idCont.remove()
            },5000);
    }
