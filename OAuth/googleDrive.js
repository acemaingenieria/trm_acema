const { google } = require("googleapis");

const drive = google.drive({
  version: "v3",
  auth: process.env.API_KEY
});

async function subirArchivo(filePath, fileName) {
  const fs = require("fs");

  try {
    const response = await drive.files.create({
      requestBody: { name: fileName, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      media: { body: fs.createReadStream(filePath) },
    });

    console.log("✅ Archivo subido con éxito:", response.data);
    return response.data.id;
  } catch (error) {
    console.error("❌ Error subiendo archivo:", error.message);
    return null;
  }
}

module.exports = { subirArchivo };