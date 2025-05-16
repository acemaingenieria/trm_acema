async function consultarTRM() {
  let fechaInicio = document.getElementById("fechaInicio").value;
  let fechaFin = document.getElementById("fechaFin").value;
  let hoy = new Date().toISOString().split("T")[0];

  if (!fechaInicio || !fechaFin) {
    mostrarMensaje("⚠️ Ingresa ambas fechas antes de generar el reporte.");
    return;
  }

  if (fechaFin > hoy) {
    mostrarMensaje("❌ No puedes seleccionar una fecha futura.");
    return;
  }

  let response = await fetch("https://trm-acema-5vmslahie-acemas-projects-622f8fd5.vercel.app/trm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaInicio, fechaFin }),
  });

  let data = await response.json();

  if (data.archivo) {
    let link = document.createElement("a");
    link.href = "https://trm-acema-5vmslahie-acemas-projects-622f8fd5.vercel.app" + data.archivo;
    link.download = `TRM_${fechaInicio}_a_${fechaFin}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarMensaje("✅ Archivo descargado exitosamente.");
    limpiarCampos();
  } else {
    mostrarMensaje("❌ Hubo un error al generar el archivo.");
  }
}

function mostrarMensaje(mensaje) {
  document.getElementById("mensaje").innerHTML = mensaje;
}

function limpiarCampos() {
  document.getElementById("fechaInicio").value = "";
  document.getElementById("fechaFin").value = "";
}