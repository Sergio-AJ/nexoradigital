fetch("php/obtener-citas.php")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("listaCitas");
    if (data.length === 0) {
      contenedor.innerText = "No hay citas registradas.";
      return;
    }

    const lista = document.createElement("ul");
    data.forEach(cita => {
      const item = document.createElement("li");
      item.textContent = `${cita.fecha} - ${cita.nombre} (${cita.email}): ${cita.motivo}`;
      lista.appendChild(item);
    });
    contenedor.innerHTML = ""; // limpiar "Cargando..."
    contenedor.appendChild(lista);
  })
  .catch(err => {
    console.error(err);
    document.getElementById("listaCitas").innerText = "Error al obtener citas.";
  });
