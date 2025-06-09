<?php
$servidor="localhost";
$usuario="root";
$pass="";
$base_datos="nexora"; // Nombre de la base de datos

$conexion= mysqli_connect($servidor,$usuario,$pass,$base_datos);
if(!$conexion){
    die("Error al conectar ". mysqli_connect_error());
}
?>