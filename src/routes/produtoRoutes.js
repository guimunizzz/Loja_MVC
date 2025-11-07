const express = require('express');
const produtoRoutes = express.Router();
const {produtoController} = require('../controllers/produtoController');

produtoRoutes.get('/produtos', produtoController.selecionaTodos)
produtoRoutes.post('/produtos', produtoController.incluiRegistros)
produtoRoutes.delete('/produtos', produtoController.deletaProdutos)

module.exports = { produtoRoutes };