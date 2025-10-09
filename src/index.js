require('dotenv').config(); // cargar variables de entorno
const express = require('express'); 
const jwt = require('jsonwebtoken'); // trabajar con JWT
const setUpRoutes = require('./router'); // tus rutas adicionales

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.SECRET; // clave secreta para firmar tokens

app.use(express.json()); // parsea JSON del cuerpo de las peticiones

// Rutas de autenticación
app.post("/token", (req, res) => {
    // ejemplo estático de usuario
    const { id: sub, name } = { id: "andreshenao", name: "Andres Henao" };
    
    const token = jwt.sign(
        {
            name,
            exp: Date.now() + 120 * 1000 // expiración en milisegundos
        }, 
        secret
    );

    res.send({ token });
});

// Ruta pública
app.get("/public", (req, res) => {
    res.send("Esta ruta es pública, no necesita token");
});

// Ruta privada con verificación de JWT
app.get("/private", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("No se proporcionó token");

        const token = authHeader.split(" ")[1]; // Bearer <token>
        const payload = jwt.verify(token, secret);

        if (payload.exp < Date.now()) {
            return res.status(401).send({ error: "El token ha expirado" });
        }

        res.send("Esta ruta es privada");
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

// Rutas adicionales del router modular
setUpRoutes(app);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

