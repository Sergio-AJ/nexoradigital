document.getElementById("formCita").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const formData = new FormData(this);
  
    fetch("php/pedir-cita.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(data => {
      document.getElementById("mensajeCita").innerText = data;
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("mensajeCita").innerText = "No se pudo pedir la cita.";
    });
  });
  