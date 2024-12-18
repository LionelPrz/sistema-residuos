// Variables relacionadas con el formulario

let form = document.querySelector(".formulario");
let selectD = document.getElementById("residuo");
let access = document.getElementById("acceso");
let ilat = document.getElementById("lat");
let ilong = document.getElementById("long");
let inputs = document.querySelectorAll('#formulario input,select,textarea');
let btnAlert = document.getElementById('btn-submit');
let fechador = document.getElementById("fecha");

// Variable para cargar los datos del formulario
let formdata;

    const expresiones = {
	    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        dni: /^\d{8}$/, //8 numeros.
        informe: /^[a-zA-ZÀ-ÿ0-9\s.,;!?(){}[\]'"-]{1,250}$/,  // Permite letras, números, espacios y signos de puntuación
        tipo_residuo: /^(Microbasural|Macrobasural|Basural Municipal)$/, // Tres valores posibles.
        tipo_acceso: /^(facil|complicado|dificil)$/, // Tres valores posibles.
        fecha: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,  //Validaciones para la fecha.
        latitud: /^-?([1-8]?[0-9](\.\d{1,6})?|90(\.0{1,8})?)$/,  // Latitud entre -90 y 90, hasta 6 decimales
        longitud: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d{1,8})?|180(\.0{1,6})?)$/,  // Longitud entre -180 y 180, hasta 6 decimales
}

    const campos = {
        // creacion de campos para el formulario
        nombre: false,
        apellido: false,
        dni: false,
        informe: false,
        latitud:false,
        longitud:false,
        tipo_residuo:false,
        tipo_acceso:false,
        fecha: false,
        // creacion de los campos bandera para el control de flujo
        alertInfo: false,
        ejecucion: false,
        latitudCargada: false,
        longitudCargada: false,
        fechaCargada: false,
}

    form.addEventListener('submit',(e)=>{
        e.preventDefault();

    if(Object.values(campos).every((campo)=>campo)){
        // Creacion del objeto de Formulario para su envio
        formdata = new FormData(form);
        
        // Envio de los datos
        fetch('../php/recepcion-datos.php',{
            method: 'POST',
            body: formdata

        }).then(function(response){
            return response.json();
        }).then(function(data){
            console.log(data);
        })
        .catch((error)=>{
            generateAlert('error',error);
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
        if(!campos.ejecucion){
            // limmpieza de las opciones anteriores
            selectD.innerHTML = '';
            access.innerHTML = '';

            selectD.insertAdjacentHTML('beforeend',`
                <option disabled selected>Tipo de Residuo</option>
                <option value="Microbasural">Microbasural</option>
                <option value="Macrobasural">Macrobasural</option>
                <option value="Basural Municipal">Basural Municipal</option>
        `);
            access.insertAdjacentHTML('beforeend',`
                <option disabled selected>Indice de accesibilidad</option>
                <option value="facil">Acceso facil</option>
                <option value="complicado">Acceso complicado</option>
                <option value="dificil">Acceso dificil</option>
        `);
            campos.ejecucion = true;
    }
});

// Validaciones y Solicitud de latitud y longitud y de fecha
ilat.addEventListener('click',obtenerUbicacion);
ilong.addEventListener('click',obtenerUbicacion);
fechador.addEventListener('click',obtenerFecha);


function obtenerUbicacion(){

if(!campos.alertInfo){
    navigator.permissions.query({name:'geolocation'})
    .then(function(result){
        if(result.state === 'granted'){
            success();
        }
        else if(result.state === 'prompt'){
            info();

        }
        else if(result.state === 'denied'){
            error(error);

        }
    });

function info(){
    navigator.geolocation.getCurrentPosition(success,error);
    generateAlert("info", "Necesitamos acceder a tu ubicacion para completar el formulario. Por favor, permita el acceso !");
    campos.alertInfo = false;
}

function success(position){
    navigator.geolocation.getCurrentPosition(success,error);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

        ilat.value = `${latitude}`;
        validarCampo(expresiones.latitud, ilat, 'latitud');

        ilong.value = `${longitude}`;
        validarCampo(expresiones.longitud, ilong, 'longitud');

        generateAlert("success","Ubicacion obtenida con exito");

        // Asignar solo lectura a los campos ya completados y validarlos
        ilat.readOnly = true;
        ilong.readOnly = true;
        campos.latitudCargada = true;
        campos.longitudCargada = true;
        campos.alertInfo = true;
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
        campos.alertInfo = false;

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
        case "informe":
            validarCampo(expresiones.informe,e.target,'informe');
        break;
        case "tipo_residuo":
            validarCampo(expresiones.tipo_residuo,e.target,'tipo_residuo');
        break;
        case "fecha":
            validarCampo(expresiones.fecha,e.target,'fecha');
        break;
        case "tipo_acceso":
            validarCampo(expresiones.tipo_acceso,e.target,'tipo_acceso');
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

function resetForm(){
    // Reiniciar el formulario
    form.reset();

    // Reinicio los estados de los campos y sus estilos
    document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
        icono.classList.remove('formulario__grupo-correcto');
        icono.classList.remove('formulario__grupo-incorrecto');
        });

    // Ocultar el mensaje de error si es que estubiera activo
    document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');

    // Reinicio de los estados de validacion
    for(let campo in campos){
        campos[campo] = false;
    } 
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

function obtenerFecha(){
    let fecha = new Date();
    fechador.value = fecha.toISOString().split('T')[0];
    fechador.readOnly = true;
    campos.fechaCargada = true;
}