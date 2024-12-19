<?php
// Incluir conexión a la base de datos
include 'conexion.php';
session_start();



if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $dni = $_POST['dni'];
    $tipo_residuo = $_POST['tipo_residuo'];
    $fecha = $_POST['fecha'];
    $latitud = $_POST['latitud'];
    $longitud = $_POST['longitud'];
    $informe = $_POST['informe'];

    $campos = [
      'nombre' => $nombre,
      'apellido' => $apellido,
      'dni' => $dni,
      'tipo_residuo' => $tipo_residuo,
      'fecha' => $fecha,
      'latitud' => $latitud,
      'longitud' => $longitud,
      'informe' => $informe
    ];

    echo'$campos';
    // Respuesta en formato JSON
echo json_encode($campos);
}else{
    echo json_encode("No se ha enviado un POST");
}

?>
