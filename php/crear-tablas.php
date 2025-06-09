<?php
include 'conexion.php'; // Corregido: include en lugar de includes
$conexion=mysqli_connect($servidor,$usuario,$pass,"nexora"); // Seleccionar base de datos

// TABLA SERVICIOS
$sqlServicios="CREATE TABLE IF NOT EXISTS Servicios(
    ID_Servicio INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    estado VARCHAR(25) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
)";
if(mysqli_query($conexion,$sqlServicios)){
    echo "Tabla Servicios creada correctamente<br>";
} else {
    echo "Error creando tabla Servicios: " . mysqli_error($conexion) . "<br>";
}

// TABLA EMPRESAS - CORREGIDA LA SINTAXIS DE FOREIGN KEY
$sqlEmpresas="CREATE TABLE IF NOT EXISTS Empresas(
    ID_Empresa INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(50) NOT NULL,
    servicioEmp INTEGER(10),
    FOREIGN KEY (servicioEmp) REFERENCES Servicios(ID_Servicio)
)";
if(mysqli_query($conexion,$sqlEmpresas)){
    echo "Tabla Empresas creada correctamente<br>";
} else {
    echo "Error creando tabla Empresas: " . mysqli_error($conexion) . "<br>";
}

// TABLA PARTICULARES - CORREGIDA LA SINTAXIS DE FOREIGN KEY
$sqlParticulares="CREATE TABLE IF NOT EXISTS Particulares(
    ID_Particular INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    DNI VARCHAR(20) NOT NULL UNIQUE, -- Cambiado a VARCHAR para DNIs con letras
    servicioPar INTEGER(10),
    FOREIGN KEY (servicioPar) REFERENCES Servicios(ID_Servicio)
)";
if(mysqli_query($conexion,$sqlParticulares)){
    echo "Tabla Particulares creada correctamente<br>";
} else {
    echo "Error creando tabla Particulares: " . mysqli_error($conexion) . "<br>";
}

// TABLA CONTRATACIONES
$sqlContrataciones="CREATE TABLE IF NOT EXISTS Contrataciones (
    ID_Contratacion INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Particular INTEGER NULL,
    ID_Empresa INTEGER NULL,
    ID_Servicio INTEGER NOT NULL,
    Fecha_Contratacion DATE NULL,
    FOREIGN KEY (ID_Particular) REFERENCES Particulares(ID_Particular),
    FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa),
    FOREIGN KEY (ID_Servicio) REFERENCES Servicios(ID_Servicio)
)";
if(mysqli_query($conexion,$sqlContrataciones)){
    echo "Tabla Contrataciones creada correctamente<br>";
} else {
    echo "Error creando tabla Contrataciones: " . mysqli_error($conexion) . "<br>";
}

// TABLA VALORACIONES
$sqlValoraciones="CREATE TABLE IF NOT EXISTS Valoraciones(
    ID_Valoracion INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    ID_Particular INTEGER NOT NULL,
    ID_Empresa INTEGER NULL,
    ID_Servicio INTEGER NOT NULL,
    valoracion INTEGER NOT NULL CHECK (valoracion >= 1 AND valoracion <= 5),
    comentario TEXT,
    fecha_valoracion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Particular) REFERENCES Particulares(ID_Particular),
    FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa),
    FOREIGN KEY (ID_Servicio) REFERENCES Servicios(ID_Servicio)
)";
if(mysqli_query($conexion,$sqlValoraciones)){
    echo "Tabla Valoraciones creada correctamente<br>";
} else {
    echo "Error creando tabla Valoraciones: " . mysqli_error($conexion) . "<br>";
}

// TABLA USUARIOS - CORREGIDA LA LÓGICA
$sqlUsuarios="CREATE TABLE IF NOT EXISTS Usuarios(
    ID_Usuario INTEGER(10) PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('particular', 'empresa') NOT NULL,
    ID_Particular INTEGER NULL,
    ID_Empresa INTEGER NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remember_token VARCHAR(100) NULL,
    FOREIGN KEY (ID_Particular) REFERENCES Particulares(ID_Particular),
    FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa)
)";
if(mysqli_query($conexion,$sqlUsuarios)){
    echo "Tabla Usuarios creada correctamente<br>";
} else {
    echo "Error creando tabla Usuarios: " . mysqli_error($conexion) . "<br>";
}

// TABLA CITAS - NUEVA TABLA NECESARIA
$sqlCitas="CREATE TABLE IF NOT EXISTS citas(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if(mysqli_query($conexion,$sqlCitas)){
    echo "Tabla citas creada correctamente<br>";
} else {
    echo "Error creando tabla citas: " . mysqli_error($conexion) . "<br>";
}

mysqli_close($conexion);
?>