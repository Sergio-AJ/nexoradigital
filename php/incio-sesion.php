<?php
session_start();

// Usar la configuración de conexión consistente
include 'conexion.php';

try {
    // Conexión a la base de datos con PDO usando las variables del archivo conexion.php
    $pdo = new PDO("mysql:host=$servidor;dbname=nexora;charset=utf8", $usuario, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Función para generar un token CSRF
function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Procesar el formulario si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar el token CSRF
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $_SESSION['error'] = "Error de seguridad. Intenta de nuevo.";
        header("Location: login.html");
        exit;
    }

    // Obtener y sanitizar los datos del formulario
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $remember = isset($_POST['remember']) ? true : false;

    // Validar campos
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Por favor, completa todos los campos.";
        header("Location: login.html");
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "El formato del email no es válido.";
        header("Location: login.html");
        exit;
    }

    // Consultar el usuario en la base de datos
    try {
        $stmt = $pdo->prepare("SELECT ID_Usuario, email, password, Nombre, tipo_usuario FROM Usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe y la contraseña es correcta
        if ($user && password_verify($password, $user['password'])) {
            // Iniciar sesión
            $_SESSION['user_id'] = $user['ID_Usuario'];
            $_SESSION['user_name'] = $user['Nombre'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_type'] = $user['tipo_usuario'];

            // Si seleccionó "Recordarme", crear una cookie
            if ($remember) {
                $token = bin2hex(random_bytes(16));
                $expires = time() + 30 * 24 * 60 * 60; // 30 días
                setcookie('remember_me', $token, $expires, '/', '', true, true);

                // Guardar el token en la base de datos
                $stmt = $pdo->prepare("UPDATE Usuarios SET remember_token = ? WHERE ID_Usuario = ?");
                $stmt->execute([$token, $user['ID_Usuario']]);
            }

            // Redirigir a la página de inicio o dashboard
            header("Location: dashboard.php");
            exit;
        } else {
            $_SESSION['error'] = "Correo o contraseña incorrectos.";
            header("Location: login.html");
            exit;
        }
    } catch (PDOException $e) {
        $_SESSION['error'] = "Error en la base de datos.";
        error_log("Error de base de datos: " . $e->getMessage());
        header("Location: login.html");
        exit;
    }
}

// Generar un nuevo token CSRF para el formulario
$csrf_token = generateCsrfToken();
?>
