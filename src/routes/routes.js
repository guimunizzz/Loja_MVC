const express = require('express');
const router = express.Router();
const { produtoRoutes } = require('./produtoRoutes');
const { clienteRoutes } = require('./clienteRoutes');

router.use('/', produtoRoutes);
router.use('/', clienteRoutes);

router.use((req, res) => {
    res.status(404).json({
        message: 'Pagina não encontrada'
    });
});

module.exports = { router };