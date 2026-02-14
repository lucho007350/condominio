
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const jwt = require('jsonwebtoken'); // Para trabajar con JWT
const setUpRoutes = require('./router'); // Archivo que contiene las rutas de residentes y unidad habitacional

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.SECRET; // Clave secreta definida en el archivo .env

app.use(express.json()); // Parsear JSON del cuerpo de las peticiones

// ==========================
// 🔹 CONFIGURACIÓN CORS (Sin restricciones)
// ==========================
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
}); ////// cambios con el parsero

// ==========================
// 🔹 RUTAS DE AUTENTICACIÓN
// ==========================
app.post("/token", (req, res) => {
    // Usuario de ejemplo (en producción vendría de la base de datos)
    const { id: sub, name } = { id: "luisfelipe", name: "Luis Felipe" };

    const token = jwt.sign(
        {
            name,
            exp: Date.now() + 120 * 1000 // Token válido por 2 minutos
        },
        secret
    );

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
        const payload = jwt.verify(token, secret);

        if (payload.exp < Date.now()) {
            return res.status(401).send({ error: "El token ha expirado" });
        }

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