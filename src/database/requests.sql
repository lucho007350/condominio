-- Tabla para PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
CREATE TABLE IF NOT EXISTS requests (
    idRequest INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('peticion', 'queja', 'reclamo', 'sugerencia') NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'rechazado') DEFAULT 'pendiente',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    propietarioId INT NULL,
    propietarioNombre VARCHAR(255) NULL,
    remitenteUsuario VARCHAR(100) NULL,
    remitenteNombre VARCHAR(255) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_remitente (remitenteUsuario),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha)
);
