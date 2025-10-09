const jwt = require('jsonwebtoken');
require('dotenv').config(); // para usar process.env.SECRET

const secret = process.env.SECRET; // la clave secreta que definiste en .env

// Middleware para proteger rutas
function authenticateToken(req, res, next) {
    // 1️⃣ Obtener el encabezado Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "Token requerido" });
    }

    // 2️⃣ Extraer el token (formato: Bearer <token>)
    const token = authHeader.split(' ')[1];

    try {
        // 3️⃣ Verificar la validez del token
        const payload = jwt.verify(token, secret);

        // 4️⃣ Verificar que no haya expirado
        if (payload.exp < Date.now()) {
            return res.status(401).json({ error: "Token expirado" });
        }

        // 5️⃣ Guardar información del usuario en la request (opcional)
        req.user = payload;

        // 6️⃣ Continuar al siguiente middleware o ruta
        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}

module.exports = authenticateToken;
