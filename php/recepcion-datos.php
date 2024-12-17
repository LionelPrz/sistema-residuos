<?php
include 'conexion.php';

error_log($_SERVER['REQUEST_METHOD']);

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Definir los campos esperados y sus filtros
    $campos = [
        "nombre" => FILTER_SANITIZE_STRING,
        "apellido" => FILTER_SANITIZE_STRING,
        "dni" => FILTER_SANITIZE_NUMBER_INT,
        "residuo" => FILTER_SANITIZE_STRING,
        "latitud" => FILTER_VALIDATE_FLOAT,
        "longitud" => FILTER_VALIDATE_FLOAT,
        "fecha" => FILTER_SANITIZE_STRING,
        "acceso" => FILTER_SANITIZE_STRING,
        "texto" => FILTER_SANITIZE_STRING,
    ];

    // Aplicar los filtros dinámicamente
    $datos = filter_input_array(INPUT_POST, $campos);

    // Validar campos obligatorios
    $campos_obligatorios = ["nombre", "apellido","residuo", "dni", "latitud", "longitud", "fecha", "acceso","texto"];
    foreach ($campos_obligatorios as $campo) {
        if (empty($datos[$campo])) {
            http_response_code(400);
            echo json_encode(["error" => "El campo '$campo' es obligatorio o inválido"]);
            exit;
        }
    }

    // Preparar respuesta
    $respuesta = [
        "nombre" => $datos["nombre"],
        "apellido" => $datos["apellido"],
        "dni" => $datos["dni"],
        "tipo_residuo" => $datos["residuo"],
        "lat" => $datos["latitud"],
        "long" => $datos["longitud"],
        "fecha" => $datos["fecha"],
        "accesibilidad" => $datos["acceso"],
        "texto" => $datos["texto"]
    ];

    // Enviar respuesta en JSON
    header('Content-Type: application/json');
    echo json_encode($respuesta);

} else {
    // Método no permitido
    http_response_code(405);
    echo "Método no permitido";
}



?>
