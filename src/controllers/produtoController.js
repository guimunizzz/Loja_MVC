const { produtoModel } = require('../models/produtoModels');

const produtoController = {

    // /**
    //  * Retorna os produtos cadastrados
    //  * Rota GET /produtos
    //  * @async
    //  * @function selecionaTodos
    //  * @param {Request} req Objeto da requisição http
    //  * @param {Response} res Objeto da resposta http
    //  * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
    //  */
    selecionaTodos: async (req, res) => {
        try {
            const {id} = req.query;
            const resultado = await produtoModel.selectAll();
            const resultadoPorId = await produtoModel.selectById(id);

            if (resultado.length === 0) {
                return res.status(200).json({
                    message: 'A consulta não retornou resultados'
                })
            }
            if (resultadoPorId.length === 0) {
                res.status(200).json({
                    'Resultado': resultado
                });
            }
            res.status(200).json({
                'Resultado': resultadoPorId
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },
    incluiRegistros: async (req, res) => {
        try {
            const { nome, valor } = req.body

            if (!nome || !valor || !isNaN(nome) || isNaN(valor)) {
                return res.status(400).json({
                    message: 'Verifique os dados enviados e tente novamente!'
                })
            }

            const resultado = await produtoModel.insert(nome, valor);

            if (resultado.insertId === 0) {
                throw new Error("Valor não inserido");
            }
            res.status(201).json({
                message: 'Registro incluido com sucesso',
                data: resultado
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    alteraProdutos: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const { descricao, valor } = req.body;

            if (!idProduto || !descricao || !valor || !isNaN(descricao) || !isNaN(valor) || typeof idProduto != 'number') {
                return res.status(400).json({
                    message: 'Verifique os dados enviados e tente novamente'
                })
            };
            const produtoAtual = await produtoModel.selectById(idProduto);
            if (produtoAtual.length === 0) {
                return res.status(200).json({
                    message: 'Produto não localizado'
                });
            };
            const novaDescricao = descricao ?? produtoAtual[0].nome
            const novoValor = valor ?? produtoAtual[0].valor

            const resultUpdate = await produtoModel.update(idProduto, novaDescricao, novoValor);
            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
                return res.status(200).json({
                    message: 'Não a alterações a serem realizadas'
                });
            };

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
                return res.status(200).json({
                    message: 'Registro alterado com sucesso'
                });
            };
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            })
        }
    },

    deletaProdutos: async (req, res) => {
        try {
            const produtoSelecionado = await produtoModel.selectById(idProduto);
            if (produtoSelecionado.length ===0) {
                return res.status(200).json ({
                    message: 'Produto não localizado na base de dados'
                });
            }

            const resultadoDelete = await produtoModel.delete(idProduto);
            if (resultadoDelete.affectedRows === 0) {
                return res.status(200).json ({
                    message: 'Ocorreu um erro ao excluir o produto'
                });   
            }

            res.status(200).json({
                message: 'Produto excluido com sucesso'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            })
        }
    }
}
module.exports = { produtoController };