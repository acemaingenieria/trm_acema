const express = require("express");
const cors = require("cors");
const axios = require("axios");
const xlsx = require("xlsx");
const fs = require("fs");
const { subirArchivo } = require("./Auth/googleDrive");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/trm", async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "⚠️ Debes ingresar una fecha de inicio y fin." });
    }

    const datosTRM = [];
    for (let fecha = new Date(fechaInicio); fecha <= new Date(fechaFin); fecha.setDate(fecha.getDate() + 1)) {
        let fechaStr = fecha.toISOString().split("T")[0];
        let url = `https://trm-colombia.vercel.app/?date=${fechaStr}`;
        try {
            let response = await axios.get(url);
            if (response.data?.data?.value) {
                datosTRM.push({ Fecha: fechaStr, TRM: response.data.data.value.toFixed(2) });
            }
        } catch (error) {
            console.error(`❌ Error obteniendo la TRM del ${fechaStr}:`, error.message);
        }
    }

    const libro = xlsx.utils.book_new();
    const hoja = xlsx.utils.json_to_sheet(datosTRM);
    xlsx.utils.book_append_sheet(libro, hoja, "TRM Rango");

    const fileName = `TRM_${fechaInicio}_a_${fechaFin}.xlsx`;
    const filePath = fileName;
    xlsx.writeFile(libro, filePath);

    try {
        const fileUrl = await subirArchivo(filePath, fileName);
        if (!fileUrl) throw new Error("❌ Error al subir el archivo a Google Drive.");
        fs.unlinkSync(filePath);
        res.json({ mensaje: "✅ Archivo subido exitosamente.", fileUrl });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Servidor corriendo en https://trm-acema.vercel.app/"));