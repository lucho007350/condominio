const { Router } = require('express');
const DocumentoService = require('../services/documento.service.js');
const { createDocumentoSchema, updateDocumentoSchema, getDocumentoSchema } = require('../schemas/documento.schema.js');
const validatorHandler = require('../middlewares/validator.handle.js');
const authenticateToken = require('../middlewares/authenticateToken.js');

const router = Router();
const documentoService = new DocumentoService();

// Obtener todos los documentos (privado)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const documentos = await documentoService.get();
        res.status(200).json(documentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los documentos' });
    }
});

// Crear un documento
router.post(
    '/',
    validatorHandler(createDocumentoSchema, 'body'),
    async (req, res) => {
        try {
            const { nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado } = req.body;
            const documento = await documentoService.create(nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado);
            res.status(201).json(documento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear el documento' });
        }
    }
);

// Obtener un documento por ID
router.get(
    '/:id',
    validatorHandler(getDocumentoSchema, 'params'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const documento = await documentoService.getById(id);

            if (!documento) {
                return res.status(404).json({ message: 'Documento no encontrado' });
            }

            res.status(200).json(documento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el documento' });
        }
    }
);

// Actualizar un documento
router.put(
    '/:id',
    validatorHandler(getDocumentoSchema, 'params'),
    validatorHandler(updateDocumentoSchema, 'body'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado } = req.body;

            const documento = await documentoService.update(id, nombre, tipo, fechaCreacion, idUnidad, idEmpleado, idComunicado);

            if (!documento) {
                return res.status(404).json({ message: 'Documento no encontrado' });
            }

            res.status(200).json(documento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el documento' });
        }
    }
);

// Eliminar un documento
router.delete(
    '/:id',
    validatorHandler(getDocumentoSchema, 'params'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const result = await documentoService.delete(id);

            if (!result) {
                return res.status(404).json({ message: 'Documento no encontrado' });
            }

            res.status(200).json({ message: 'Documento eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar el documento' });
        }
    }
);

module.exports = router;