const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const xlsx = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/trm", async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res
      .status(400)
      .json({
        error: "⚠️ Debes ingresar una fecha de inicio y una fecha de fin.",
      });
  }

  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);
  const datosTRM = [];

  console.log(`🔄 Generando TRM desde ${fechaInicio} hasta ${fechaFin}...`);

  for (
    let fecha = startDate;
    fecha <= endDate;
    fecha.setDate(fecha.getDate() + 1)
  ) {
    let fechaStr = fecha.toISOString().split("T")[0];
    let url = `https://trm-colombia.vercel.app/?date=${fechaStr}`;

    try {
      let response = await axios.get(url);
      if (response.data?.data?.value) {
        let trm = response.data.data.value;
        datosTRM.push({ Fecha: fechaStr, TRM: trm.toFixed(2) });
      }
    } catch (error) {
      console.error(
        `❌ Error obteniendo la TRM del ${fechaStr}:`,
        error.message
      );
    }
  }

  const carpeta = path.join(__dirname, "TRM_List");
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta);
  }

  const nombreArchivo = `TRM_${fechaInicio}_a_${fechaFin}.xlsx`;
  const rutaArchivo = path.join(carpeta, nombreArchivo);

  const libro = xlsx.utils.book_new();
  const hoja = xlsx.utils.json_to_sheet(datosTRM);
  xlsx.utils.book_append_sheet(libro, hoja, "TRM Rango");
  xlsx.writeFile(libro, rutaArchivo);

  res.json({ archivo: `/download?file=${nombreArchivo}` });
});

app.get("/download", (req, res) => {
  const { file } = req.query;
  const rutaArchivo = path.join(__dirname, "TRM_List", file);

  if (fs.existsSync(rutaArchivo)) {
    res.download(rutaArchivo);
  } else {
    res.status(404).json({ error: "❌ El archivo solicitado no existe." });
  }
});

app.get("/trm-mes", async (req, res) => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();

  const fechaInicio = `${anio}-${mes.toString().padStart(2, "0")}-01`;
  const fechaFin = `${anio}-${mes.toString().padStart(2, "0")}-${diaActual}`;

  res.redirect(`/trm?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
