async function consultarTRM() {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let hoy = new Date().toISOString().split("T")[0];

    if (!fechaInicio || !fechaFin) {
        mostrarMensaje("⚠️ Ingresa ambas fechas antes de generar el reporte.");
        return;
    }

    if (fechaInicio > fechaFin) {
        mostrarMensaje("❌ La fecha de inicio no puede ser mayor que la fecha de fin.");
        return;
    }

    if (fechaFin > hoy) {
        mostrarMensaje("❌ No puedes seleccionar una fecha futura.");
        return;
    }

    try {
        let response = await fetch("https://trm-acema.vercel.app/trm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fechaInicio, fechaFin }),
        });

        if (!response.ok) throw new Error(`❌ Error en la API: ${response.status} ${response.statusText}`);

        let data = await response.json();

        if (data.fileId) {
            let link = document.createElement("a");
            link.href = `https://drive.google.com/uc?id=${data.fileId}&export=download`;
            link.download = `TRM_${fechaInicio}_a_${fechaFin}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            mostrarMensaje("✅ Archivo descargado exitosamente.");
            limpiarCampos();
        } else {
            throw new Error("❌ Hubo un error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function mostrarMensaje(mensaje) {
    document.getElementById("mensaje").innerHTML = mensaje;
}

function limpiarCampos() {
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";
}