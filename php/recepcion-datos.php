<?php
    include "conexion.php";

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
// Definir los campos esperados (sin usar los filtros sanitizadores desactualizados)
$campos = [
    "nombre",
    "apellido" ,
    "dni" => FILTER_SANITIZE_NUMBER_INT,
    "residuo" ,
    "latitud" => FILTER_VALIDATE_FLOAT,
    "longitud" => FILTER_VALIDATE_FLOAT,
    "fecha" ,
    "acceso" ,
    "texto" ,
];

// Filtrar datos usando htmlspecialchars en lugar de los filtros sanitizadores
$datos = [];
foreach ($_POST as $key => $value) {
    if (in_array($key, ['nombre', 'apellido', 'residuo', 'acceso', 'texto'])) {
        // Sanitizar solo los campos de tipo texto usando htmlspecialchars
        $datos[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    } else {
        // Los demás campos no requieren htmlspecialchars, solo validarlos
        $datos[$key] = $value;
    }
}

// Validación de tipos de datos
// Ejemplo de validación: comprobar que los números son válidos
if (!is_numeric($datos['dni'])) {
    http_response_code(400);
    error_log(json_encode(["error" => "El campo 'dni' debe ser un número"])); 
    exit;
}

if (!filter_var($datos['latitud'], FILTER_VALIDATE_FLOAT)) {
    http_response_code(400);
    error_log(json_encode(["error" => "El campo 'latitud' debe ser un número flotante válido"]));
    exit;
}

if (!filter_var($datos['longitud'], FILTER_VALIDATE_FLOAT)) {
    http_response_code(400);
    error_log(json_encode(["error" => "El campo 'longitud' debe ser un número flotante válido"]));
    exit;
}

// Validación de campos obligatorios
$campos_obligatorios = ["nombre", "apellido", "residuo", "dni", "latitud", "longitud", "fecha", "acceso", "texto"];
foreach ($campos_obligatorios as $campo) {
    if (empty($datos[$campo])) {
        http_response_code(400);
        error_log(json_encode(["error" => "El campo '$campo' es obligatorio o inválido"]));
        exit;
    }
}

// Ahora los datos están validados y sanitizados
// Puedes proceder con el siguiente paso de tu aplicación, como insertar en la base de datos
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
        "texto" => $datos["texto"],
    ];

    // Enviar respuesta en JSON
    header('Content-Type: application/json');
    echo json_encode($respuesta);

} else {
        // Método no permitido
    error_log("Metodo no permitido".$_SERVER['REQUEST_METHOD']);
    http_response_code(405);
}

// Insertar los datos a la BD
try{
    $slq = "INSERT INTO tabla_residuos(nombre,apellido,dni,residuo,latitud,longitud,fecha,acceso,texto)
            VALUES(:nombre,:apellido,:dni,:residuo,:latitud,:longitud,:fecha,:acceso,:texto)";

            $stmt = $pdo-> prepare($sql);
// BIND de parametros
$stmt->bindParam(":nombre", $datos["nombre"]);
$stmt->bindParam(":apellido", $datos["apellido"]);
$stmt->bindParam(":dni", $datos["dni"]);
$stmt->bindParam(":residuo", $datos["residuo"]);
$stmt->bindParam(":latitud", $datos["latitud"]);
$stmt->bindParam(":longitud", $datos["longitud"]);
$stmt->bindParam(":fecha", $datos["fecha"]);


}catch(PDOException $e){

}

?>
