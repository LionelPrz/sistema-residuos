<?php
    error_log($_SERVER['REQUEST_METHOD']);

    // Verificar que la solicitud sea POST
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // recibir los datos del formulario
        $nombre = $_POST['nombre'];
        $dni = $_POST['dni'];
        $tipo_residuo = $_POST['residuo'];
        $lat = $_POST['lat'];
        $long = $_POST['long'];
        $fecha = $_POST['fecha'];
        $accesibilidad = $_POST['acceso'];
    }else{
        http_response_code(405); // Devolver 405 si no es POST
        echo "Método no permitido";
    }

    // Carga de los datos recibidos en un arreglo
    $respuesta = [
        'nombre' => $nombre,
        'dni' => $dni,
        'tipo_residuo' => $tipo_residuo,
        'lat' => $lat,
        'long' => $long,
        'fecha' => $fecha,
        'accesibilidad' => $accesibilidad
    ];

    // Devolver los datos en formato JSON
    header('Content-Type: application/json');
    echo json_encode($respuesta);
?>