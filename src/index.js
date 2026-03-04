
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const jwt = require('jsonwebtoken'); // Para trabajar con JWT
const setUpRoutes = require('./router'); // Archivo que contiene las rutas de residentes y unidad habitacional

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.SECRET; // Clave secreta definida en el archivo .env

app.use(express.json()); // Parsear JSON del cuerpo de las peticiones

// ==========================
// 🔹 CORS (para frontend en Vite)
// ==========================
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// ==========================
// 🔹 RUTAS DE AUTENTICACIÓN
// ==========================
app.post("/token", (req, res) => {
    // Usuario de ejemplo (en producción vendría de la base de datos)
    const { id: sub, name } = { id: "luisfelipe", name: "Luis Felipe" };

    const expiresIn = process.env.TOKEN_TTL || "2h";
    const token = jwt.sign({ name }, secret, { subject: sub, expiresIn });

    res.send({ token });
});

// ==========================
// 🔹 RUTA PÚBLICA
// ==========================
app.get("/public", (req, res) => {
    res.send("Esta ruta es pública, no necesita token");
});

// ==========================
// 🔹 RUTA PRIVADA
// ==========================
app.get("/private", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("No se proporcionó token");

        const token = authHeader.split(" ")[1]; // formato: Bearer <token>
        jwt.verify(token, secret);

        res.send("Esta ruta es privada");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

// ==========================
// 🔹 RUTAS PRINCIPALES
// ==========================
// Aquí se cargan las rutas modulares de:
// - Residentes
// - Unidades habitacionales
setUpRoutes(app);

// ==========================
// 🔹 INICIO DEL SERVIDOR
// ==========================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});