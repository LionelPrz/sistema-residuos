<?php
// Incluir conexión a la base de datos
// include 'conexion.php';

  $nombre = $_POST['nombre'];
  if($usuario === ''){
    echo json_encode("Campo Vacio");
  }else{
    echo json_enconde("dato :".$nombre);
  }
?>
