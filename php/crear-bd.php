<?php
include 'conexion.php';
$conexion=mysqli_connect($servidor,$usuario,$pass); // Sin base de datos para crearla

$sql="CREATE DATABASE IF NOT EXISTS nexora";
if(mysqli_query($conexion,$sql)){
    echo "BBDD creada correctamente"; // Añadido echo
} else {
    echo "Error al crear la base de datos: " . mysqli_error($conexion);
}
mysqli_close($conexion);
?>