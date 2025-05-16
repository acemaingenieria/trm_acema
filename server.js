const express = require("express");
const cors = require("cors");
const axios = require("axios");
const xlsx = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/trm", async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "⚠️ Debes ingresar una fecha de inicio y fin." });
    }

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const datosTRM = [];

    console.log(`🔄 Generando TRM desde ${fechaInicio} hasta ${fechaFin}...`);

    for (let fecha = startDate; fecha <= endDate; fecha.setDate(fecha.getDate() + 1)) {
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

    const buffer = xlsx.write(libro, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", `attachment; filename="TRM_${fechaInicio}_a_${fechaFin}.xlsx"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
});

app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});