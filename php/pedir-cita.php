<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Método no permitido");
}

$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$fecha = $_POST['fecha'] ?? '';
$motivo = trim($_POST['motivo'] ?? '');

// Validaciones
if (empty($nombre) || empty($email) || empty($fecha) || empty($motivo)) {
    die("Todos los campos son obligatorios.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("El formato del email no es válido.");
}

// Verificar que la fecha no sea en el pasado
$fecha_actual = date('Y-m-d');
if ($fecha < $fecha_actual) {
    die("No puedes solicitar una cita para una fecha pasada.");
}

// Insertar cita
$stmt = $conexion->prepare("INSERT INTO citas (nombre, email, fecha, motivo) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $fecha, $motivo);

if ($stmt->execute()) {
    echo "Cita solicitada correctamente para el $fecha.";

    // Correo de confirmación (opcional)
    $to = $email;
    $subject = "Cita solicitada en Nexora";
    $message = "Hola $nombre,\n\nHas solicitado una cita para el $fecha.\nMotivo: $motivo\n\nNos pondremos en contacto contigo para confirmar.";
    $headers = "From: no-reply@nexora.com";

    // Descomenta si tienes configurado el servidor de correo
    // mail($to, $subject, $message, $headers);

} else {
    echo "Error al registrar la cita: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>