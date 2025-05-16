const { google } = require("googleapis");
const { Readable } = require("stream");
require("dotenv").config();

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth });

async function subirArchivoBuffer(buffer, fileName) {
    try {
        const stream = Readable.from(buffer);

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            media: { body: stream },
        });

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
        return publicUrl;
    } catch (error) {
        console.error("❌ Error al hacer el archivo público:", error.message);
        return null;
    }
}

module.exports = { subirArchivoBuffer };
