const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth });

async function subirArchivo(filePath, fileName) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            media: { body: fs.createReadStream(filePath) },
        });

        console.log("✅ Archivo subido con éxito:", response.data);

        const fileId = response.data.id;
        const publicUrl = await hacerArchivoPublico(fileId);

        return publicUrl;
    } catch (error) {
        console.error("❌ Error subiendo archivo:", error.message);
        return null;
    }
}

async function hacerArchivoPublico(fileId) {
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const publicUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
        console.log("✅ Archivo ahora es público:", publicUrl);
        return publicUrl;
    } catch (error) {
        console.error("❌ Error al hacer el archivo público:", error.message);
        return null;
    }
}

module.exports = { subirArchivo };