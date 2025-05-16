// Asegúrate de que el script se está cargando correctamente
console.log("Script cargado");

document.addEventListener("DOMContentLoaded", function() {
    // Aseguramos que el evento se ha vinculado correctamente al botón
    const btnGenerar = document.getElementById("btnGenerar");
    if (btnGenerar) {
        btnGenerar.addEventListener("click", consultarTRM);
    }
});

async function consultarTRM() {
    console.log("Generando reporte...");

    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;

    // Validar que las fechas no estén vacías
    if (!fechaInicio || !fechaFin) {
        console.error("❌ Las fechas son obligatorias.");
        return;
    }

    // Hacer la solicitud POST al servidor
    let response = await fetch("https://trm-acema.vercel.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaInicio, fechaFin }),
    });

    // Comprobar si la solicitud fue exitosa
    if (!response.ok) {
        console.error("❌ Error en la solicitud:", response.status);
        return;
    }

    // Obtener los datos en formato JSON
    let data = await response.json();

    // Verificar si la respuesta contiene la URL de descarga
    if (data.fileUrl) {
        console.log("✅ Descarga iniciada...");
        window.location.href = data.fileUrl; // Iniciar la descarga automáticamente
    } else {
        console.error("❌ Error obteniendo la URL del archivo.");
    }
}
