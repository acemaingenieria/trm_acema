async function consultarTRM() {
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;

    let response = await fetch("http://localhost:3000/trm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaInicio, fechaFin }),
    });

    let data = await response.json();

    if (data.fileUrl) {
        window.location.href = data.fileUrl; // Descarga automática
    } else {
        console.error("❌ Error obteniendo la URL del archivo.");
    }
}