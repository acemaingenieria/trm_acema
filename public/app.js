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

  let response = await fetch("/trm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaInicio, fechaFin }),
  });

  let data = await response.json();

  if (data.archivo) {
    let link = document.createElement("a");
    link.href = data.archivo;
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

async function consultarTRMMes() {
  let hoy = new Date();
  let anio = hoy.getFullYear();
  let mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
  let diaActual = hoy.getDate();

  let fechaInicio = `${anio}-${mes}-01`;
  let fechaFin = `${anio}-${mes}-${diaActual}`;

  let response = await fetch("/trm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaInicio, fechaFin }),
  });

  let data = await response.json();

  if (data.archivo) {
    let link = document.createElement("a");
    link.href = data.archivo;
    link.download = `TRM_Mensual_${mes}_${anio}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarMensaje("✅ Archivo mensual descargado exitosamente.");
    limpiarCampos();
  } else {
    mostrarMensaje("❌ Error al generar el reporte mensual.");
  }
}

function mostrarMensaje(mensaje) {
  document.getElementById("mensaje").innerHTML = mensaje;
}

function limpiarCampos() {
  document.getElementById("fechaInicio").value = "";
  document.getElementById("fechaFin").value = "";
}
