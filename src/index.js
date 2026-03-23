
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const jwt = require('jsonwebtoken'); // Para trabajar con JWT
const joi = require('joi');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const getConnection = require('./libs/mysql');
const authenticateToken = require('./middlewares/authenticateToken.js');
const setUpRoutes = require('./router'); // Archivo que contiene las rutas de residentes y unidad habitacional

// Admin fijo (como al inicio): no depende de BD.
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.SECRET; // Clave secreta definida en el archivo .env

app.use(express.json()); // Parsear JSON del cuerpo de las peticiones

const createMailer = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 0);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const rejectUnauthorizedRaw = process.env.SMTP_TLS_REJECT_UNAUTHORIZED;
    const rejectUnauthorized = rejectUnauthorizedRaw === undefined
        ? true
        : String(rejectUnauthorizedRaw).toLowerCase() !== 'false';

    if (!host || !port || !user || !pass) return null;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
            rejectUnauthorized,
        },
    });
};

const sendCredentialsEmail = async ({ to, username, password }) => {
    const transporter = createMailer();
    if (!transporter) return { emailSent: false, reason: 'SMTP no configurado' };

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const appName = process.env.APP_NAME || 'Condominio App';
    const loginUrl = process.env.LOGIN_URL || 'http://localhost:5173/login';

    const subject = `${appName} - Credenciales de acceso`;
    const text = [
        `Hola,`,
        ``,
        `Se ha creado tu cuenta en ${appName}.`,
        ``,
        `Usuario: ${username}`,
        `Contrasena: ${password}`,
        ``,
        `Ingresa en: ${loginUrl}`,
        ``,
        `Recomendacion: cambia tu contrasena despues de ingresar.`,
    ].join('\n');

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.45">
        <h2 style="margin:0 0 12px">Credenciales de acceso</h2>
        <p style="margin:0 0 12px">Se ha creado tu cuenta en <strong>${appName}</strong>.</p>
        <div style="background:#f6f8fa;padding:12px 14px;border-radius:10px;border:1px solid #e5e7eb">
          <p style="margin:0 0 6px"><strong>Usuario:</strong> ${username}</p>
          <p style="margin:0"><strong>Contrasena:</strong> ${password}</p>
        </div>
        <p style="margin:12px 0 0">Ingresa aqui: <a href="${loginUrl}">${loginUrl}</a></p>
        <p style="margin:12px 0 0;color:#6b7280;font-size:12px">Recomendacion: cambia tu contrasena despues de ingresar.</p>
      </div>
    `.trim();

    try {
        await transporter.sendMail({ from, to, subject, text, html });
        return { emailSent: true };
    } catch (e) {
        // No hacemos fallar el registro solo porque el email falle.
        console.error('Fallo envio de correo:', e?.message || e);
        return { emailSent: false, reason: e?.message || 'Fallo envio de correo' };
    }
};

const generatePassword = () => {
    // 12 chars, URL-safe-ish
    return crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
};

const ensureUsuariosTable = async () => {
    const conn = await getConnection();
    const sqlWithFk = `
      CREATE TABLE IF NOT EXISTS usuarios (
        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
        idResidente INT NULL,
        username VARCHAR(120) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        role ENUM('admin','residente','propietario') NOT NULL DEFAULT 'residente',
        estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_usuarios_residentes FOREIGN KEY (idResidente) REFERENCES residentes(idResidente)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )
    `;

    const sqlNoFk = `
      CREATE TABLE IF NOT EXISTS usuarios (
        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
        idResidente INT NULL,
        username VARCHAR(120) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        role ENUM('admin','residente','propietario') NOT NULL DEFAULT 'residente',
        estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
        await conn.execute(sqlWithFk);
    } catch (e) {
        // Si la tabla residentes no existe o el motor no permite FK, crear sin FK.
        await conn.execute(sqlNoFk);
    }
};

const ensureResidenteUnidadTable = async () => {
    const conn = await getConnection();
    const sql = `
      CREATE TABLE IF NOT EXISTS residente_unidad (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idResidente INT NOT NULL,
        idUnidad INT NOT NULL,
        fechaInicio DATE NOT NULL,
        fechaFin DATE NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await conn.execute(sql);
    try {
        await conn.execute('CREATE INDEX idx_res_unidad_residente ON residente_unidad (idResidente)');
    } catch {
        // ignore (index may already exist)
    }
    try {
        await conn.execute('CREATE INDEX idx_res_unidad_unidad ON residente_unidad (idUnidad)');
    } catch {
        // ignore (index may already exist)
    }
};

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
// 🔹 AUTH API (registro/login)
// ==========================

const registerSchema = joi
    .object({
        nombre: joi.string().min(2).max(50).required(),
        apellido: joi.string().min(2).max(50).required(),
        documento: joi.string().min(5).max(20).required(),
        telefono: joi.string().min(7).max(15).required(),
        email: joi.string().email(),
        correo: joi.string().email(),
        username: joi.string().min(3).max(120),
        tipoResidente: joi.string().valid('Propietario', 'Arrendatario'),
        estado: joi.string().valid('Activo', 'Inactivo'),
        rol: joi.string(),
        role: joi.string(),
        password: joi.string().min(6),
        generatePassword: joi.boolean(),
        sendCredentialsEmail: joi.boolean(),
    })
    .or('email', 'correo')
    .unknown(true);

const loginSchema = joi
    .object({
        identifier: joi.string().min(3).max(255).required(),
        password: joi.string().min(6).required(),
    })
    .unknown(true);

const pickEmail = (body) => String(body?.email || body?.correo || '').trim().toLowerCase();

const normalizeRole = (body, tipoResidente) => {
    const raw = String(body?.role || body?.rol || '').toLowerCase();
    if (raw === 'admin' || raw === 'administrador') return 'admin';
    if (raw === 'propietario' || raw === 'owner') return 'propietario';
    if (raw === 'residente' || raw === 'resident') return 'residente';

    if (String(tipoResidente).toLowerCase() === 'propietario') return 'propietario';
    return 'residente';
};

const normalizeTipoResidente = (body) => {
    const tr = body?.tipoResidente;
    if (tr === 'Propietario' || tr === 'Arrendatario') return tr;
    const raw = String(body?.role || body?.rol || '').toLowerCase();
    if (raw === 'propietario' || raw === 'owner') return 'Propietario';
    return 'Arrendatario';
};

app.post('/api/auth/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map((d) => d.message) });
    }

    const body = req.body || {};
    const email = pickEmail(body);
    const username = String(body?.username || email).trim().toLowerCase();
    const estado = body?.estado === 'Inactivo' ? 'Inactivo' : 'Activo';
    const tipoResidente = normalizeTipoResidente(body);
    const role = normalizeRole(body, tipoResidente);

    // Seguridad: no permitir que cualquiera se asigne rol admin desde /register.
    if (role === 'admin') {
        return res.status(403).json({ message: 'No esta permitido crear administradores desde este endpoint' });
    }
    const shouldGenerate = body?.generatePassword !== undefined ? Boolean(body.generatePassword) : true;
    const shouldEmail = body?.sendCredentialsEmail !== undefined ? Boolean(body.sendCredentialsEmail) : true;

    const plainPassword = shouldGenerate ? generatePassword() : String(body?.password || '');
    if (!plainPassword || plainPassword.length < 6) {
        return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' });
    }

    try {
        await ensureUsuariosTable();
        const conn = await getConnection();

        // usuario existente
        const [existing] = await conn.execute(
            'SELECT idUsuario FROM usuarios WHERE username = ? OR email = ? LIMIT 1',
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Ya existe un usuario con ese correo/usuario' });
        }

        // residente (crear si no existe por documento)
        let idResidente = null;
        const [residentRows] = await conn.execute(
            'SELECT idResidente FROM residentes WHERE documento = ? LIMIT 1',
            [String(body.documento).trim()]
        );
        if (residentRows.length > 0) {
            idResidente = residentRows[0].idResidente;
        } else {
            const [insertRes] = await conn.execute(
                'INSERT INTO residentes (nombre, apellido, tipoResidente, documento, telefono, correo, estado) VALUES (?,?,?,?,?,?,?)',
                [
                    String(body.nombre).trim(),
                    String(body.apellido).trim(),
                    tipoResidente,
                    String(body.documento).trim(),
                    String(body.telefono).trim(),
                    email,
                    estado,
                ]
            );
            idResidente = insertRes.insertId;
        }

        const passwordHash = await bcrypt.hash(plainPassword, 10);

        const [insertUser] = await conn.execute(
            'INSERT INTO usuarios (idResidente, username, email, passwordHash, role, estado) VALUES (?,?,?,?,?,?)',
            [idResidente, username, email, passwordHash, role, estado]
        );

        const mail = shouldEmail ? await sendCredentialsEmail({ to: email, username, password: plainPassword }) : { emailSent: false };

        return res.status(201).json({
            idUsuario: insertUser.insertId,
            idResidente,
            username,
            email,
            role,
            emailSent: Boolean(mail.emailSent),
            emailInfo: mail.emailSent ? undefined : mail.reason,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map((d) => d.message) });
    }

    const identifier = String(req.body.identifier || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    try {
        // Admin fijo (configuracion inicial)
        if (identifier === String(ADMIN_USER).trim().toLowerCase()) {
            if (password !== String(ADMIN_PASS)) {
                return res.status(401).json({ message: 'Credenciales invalidas' });
            }

            const expiresIn = process.env.TOKEN_TTL || '2h';
            const token = jwt.sign(
                {
                    username: ADMIN_USER,
                    role: 'admin',
                },
                secret,
                { subject: String(ADMIN_USER), expiresIn }
            );

            return res.status(200).json({
                token,
                user: {
                    idUsuario: null,
                    idResidente: null,
                    username: ADMIN_USER,
                    email: null,
                    role: 'admin',
                },
            });
        }

        await ensureUsuariosTable();
        const conn = await getConnection();
        const [rows] = await conn.execute(
            'SELECT idUsuario, idResidente, username, email, passwordHash, role, estado FROM usuarios WHERE username = ? OR email = ? LIMIT 1',
            [identifier, identifier]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const u = rows[0];
        if (String(u.estado).toLowerCase() !== 'activo') {
            return res.status(403).json({ message: 'Usuario inactivo' });
        }

        const ok = await bcrypt.compare(password, u.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const expiresIn = process.env.TOKEN_TTL || '2h';
        const token = jwt.sign(
            {
                username: u.username,
                email: u.email,
                role: u.role,
                idUsuario: u.idUsuario,
                idResidente: u.idResidente,
            },
            secret,
            { subject: String(u.username), expiresIn }
        );

        return res.status(200).json({
            token,
            user: {
                idUsuario: u.idUsuario,
                idResidente: u.idResidente,
                username: u.username,
                email: u.email,
                role: u.role,
            },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al iniciar sesion' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        await ensureUsuariosTable();
        const conn = await getConnection();

        const idUsuario = req.user?.idUsuario;
        const usernameFromToken = String(req.user?.username || req.user?.sub || '').trim().toLowerCase();
        const emailFromToken = String(req.user?.email || '').trim().toLowerCase();

        if (String(req.user?.role || '').toLowerCase() === 'admin' && !idUsuario) {
            return res.status(200).json({
                user: {
                    idUsuario: null,
                    idResidente: null,
                    username: usernameFromToken || String(ADMIN_USER).trim().toLowerCase(),
                    email: null,
                    role: 'admin',
                },
                residente: null,
            });
        }

        let userRow = null;

        if (idUsuario) {
            const [rows] = await conn.execute(
                'SELECT idUsuario, idResidente, username, email, role, estado FROM usuarios WHERE idUsuario = ? LIMIT 1',
                [idUsuario]
            );
            userRow = rows?.[0] || null;
        }

        if (!userRow && (usernameFromToken || emailFromToken)) {
            const [rows] = await conn.execute(
                'SELECT idUsuario, idResidente, username, email, role, estado FROM usuarios WHERE username = ? OR email = ? LIMIT 1',
                [usernameFromToken || emailFromToken, emailFromToken || usernameFromToken]
            );
            userRow = rows?.[0] || null;
        }

        if (!userRow) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let residente = null;
        if (userRow.idResidente) {
            const [rrows] = await conn.execute(
                'SELECT idResidente, nombre, apellido, tipoResidente, documento, telefono, correo, estado FROM residentes WHERE idResidente = ? LIMIT 1',
                [userRow.idResidente]
            );
            residente = rrows?.[0] || null;
        }

        return res.status(200).json({
            user: {
                idUsuario: userRow.idUsuario,
                idResidente: userRow.idResidente,
                username: userRow.username,
                email: userRow.email,
                role: userRow.role,
            },
            residente,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al obtener perfil' });
    }
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
(async () => {
    try {
        await ensureUsuariosTable();
    } catch (e) {
        console.error('No se pudo asegurar tabla usuarios:', e?.message || e);
    }

    try {
        await ensureResidenteUnidadTable();
    } catch (e) {
        console.error('No se pudo asegurar tabla residente_unidad:', e?.message || e);
    }

    try {
        const transporter = createMailer();
        if (transporter) {
            await transporter.verify();
            console.log('SMTP OK: conexion verificada');
        } else {
            console.log('SMTP NO configurado: no se enviaran correos');
        }
    } catch (e) {
        console.error('SMTP ERROR:', e?.message || e);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
})();
