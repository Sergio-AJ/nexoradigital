<?php
include 'conexion.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Método no permitido");
}

// Recoger y sanitizar los datos
$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$contraseña = $_POST['contraseña'] ?? '';
$tipo_usuario = $_POST['tipo_usuario'] ?? 'particular'; // particular o empresa

// Validaciones
if (empty($nombre) || empty($email) || empty($contraseña)) {
    die("Todos los campos son obligatorios.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("El formato del email no es válido.");
}

if (strlen($contraseña) < 6) {
    die("La contraseña debe tener al menos 6 caracteres.");
}

$contraseña_hash = password_hash($contraseña, PASSWORD_DEFAULT);

// Verificar si el email ya está registrado
$check = $conexion->prepare("SELECT ID_Usuario FROM Usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo "Este correo ya está registrado.";
    $check->close();
    $conexion->close();
    exit;
}
$check->close();

// Insertar con consulta preparada
$stmt = $conexion->prepare("INSERT INTO Usuarios (Nombre, email, password, tipo_usuario) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $contraseña_hash, $tipo_usuario);

if ($stmt->execute()) {
    echo "Registro exitoso. Bienvenido, $nombre.";

    // Enviar correo (opcional - requiere configuración de servidor de correo)
    $to = $email;
    $subject = "Bienvenido a Nexora Digital";
    $message = "Hola $nombre,\n\nGracias por registrarte en Nexora Digital.\n\nUn saludo,\nEquipo Nexora";
    $headers = "From: no-reply@nexora.com";

    // Descomenta la siguiente línea si tienes configurado el servidor de correo
    // mail($to, $subject, $message, $headers);

} else {
    echo "Error al registrar: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>