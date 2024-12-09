let form = document.querySelector(".formulario");
let selectD = document.getElementById("residuo");
let ejecicion = false;
let ilat = document.getElementById("lat");
let ilong = document.getElementById("long");
let inputs = document.querySelectorAll('#formulario input,select,textarea');
let btnAlert = document.getElementById('btn-submit');


const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    dni: /^\d{8}$/, //8 numeros.
    texto: /^[a-zA-ZÀ-ÿ0-9\s.,;!?(){}[\]'"-]{1,250}$/,  // Permite letras, números, espacios y signos de puntuación
    residuo: /^(Microbasural|Macrobasural|Basural Municipal)$/, // Tres valores posibles.
    latitud: /^-?([1-8]?[0-9](\.\d{1,6})?|90(\.0{1,8})?)$/,  // Latitud entre -90 y 90, hasta 6 decimales
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
            generateAlert("success");
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
    obtenerUbicacion();
});

function obtenerUbicacion(){

    function success(position){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
    
        ilat.addEventListener('click',()=>{
            ilat.value = `${latitude}`;
            validarCampo(expresiones.latitud, ilat, 'latitud');
        });
        ilong.addEventListener('click',()=>{
            ilong.value = `${longitude}`;
            validarCampo(expresiones.longitud, ilong, 'longitud');
        });

        // Validacion y posterior desactivacion de los valores latitud y longitud


        disableInput();
}
    function error(){
       generateAlert("error","No se pudo obtener la ubicacion. Por favor, Active el GPS !");
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
            if(resultado != "success"){
                // Generacion del alert de error
                imagen ="./svg-assets/ayuyu-angry-png.png";
                texto = mensaje || "Se produjo un error al enviar el formulario !";
                claseText = "alert-text-error";
                clasePbar = "alert-progress-bar  red1";
                claseBar = "bar-content red";
                claseCont += " custom-alert-error";
            }
            else{
                // Generacion del alert de exito
                imagen ="./svg-assets/boochi-nato-png.png";
                texto = "¡ Formulario enviado correctamente !";
                claseCont += " custom-alert-success";
                clasePbar = "alert-progress-bar green1"
                claseBar = "bar-content green";
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