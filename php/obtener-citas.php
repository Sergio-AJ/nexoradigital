<?php
include 'conexion.php';

header('Content-Type: application/json');

try {
    $resultado = $conexion->query("SELECT nombre, email, fecha, motivo, estado FROM citas ORDER BY fecha DESC");
    
    $citas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $citas[] = $fila;
    }
    
    echo json_encode($citas);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener las citas']);
}

$conexion->close();
?>