<?php
// Incluir conexión a la base de datos
include 'conexion.php';

try{

    $nombre = $_POST['nombre'];

    // Crear Array para devolver el json completo
    $respuesta = [
        'nombre' => $nombre,
        'apellido' => $apellido,
        'dni' => $dni,
        'tipo_residuo' => $tipo_residuo,
        'acceso' => $acceso,
        'fecha' => $fecha,
        'latitud' => $latitud,
        'longitud' => $longitud,
        'informe' => $informe
    ];


    echo json_encode($respuesta);
}catch(Exception $e){
    echo json_encode(["success" => false, "error" => $e ->getMessage()]);
}
?>
