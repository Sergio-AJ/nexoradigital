document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que se recargue la página

  const formData = new FormData(this); // Recoge los datos del formulario

  fetch("php/registro.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(data => {
    document.getElementById("mensajeRegistro").innerText = data;
  })
  .catch(err => {
    console.error("Error:", err);
    document.getElementById("mensajeRegistro").innerText = "Error al procesar el registro.";
  });
});