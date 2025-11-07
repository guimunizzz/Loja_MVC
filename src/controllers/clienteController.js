const { clienteModel } = require('../models/clienteModels');

const clienteController = {
    // /**
    //  * Retorna os clientes cadastrados
    //  * Rota GET /clientes
    //  * @async
    //  * @function selecionaTodos
    //  * @param {Request} req Objeto da requisição http
    //  * @param {Response} res Objeto da resposta http
    //  * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
    //  */
    selecionaTodos: async (req, res) => {
        try {
            const { id } = req.query;
            const resultado = await clienteModel.selectAll();
            const resultadoPorId = await clienteModel.selectById(id);

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
    // /**
    //  * Insere clientes no banco de dados
    //  * Rota POST /clientes
    //  * @async
    //  * @function incluiCliente
    //  * @param {Request} req Objeto da requisição http
    //  * @param {Response} res Objeto da resposta http
    //  * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
    //  */
    incluiCliente: async (req, res) => {
        try {
            const { nome, cpf } = req.body

            if (!nome || !cpf || !isNaN(nome) || isNaN(cpf)) {
                return res.status(400).json({
                    message: 'Verifique os dados enviados e tente novamente!'
                })
            }

            const validaCpf = await clienteModel.checkCpf(cpf);

            if (validaCpf > 0) {
                return res.status(409).json({
                    message: 'Erro, esse cpf ja existe'
                })
            }

            const resultado = await clienteModel.insert(nome, cpf);

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
    // /**
    //  * Altera o registro de clientes no banco de dados
    //  * Rota PUT /clientes
    //  * @async
    //  * @function alteraCliente
    //  * @param {Request} req Objeto da requisição http
    //  * @param {Response} res Objeto da resposta http
    //  * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
    //  */
    alteraCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nome, cpf } = req.body;

            if (!idCliente || !nome || !cpf || !isNaN(nome) || isNaN(cpf)) {
                return res.status(400).json({
                    message: "Dados inválidos, tente novamente!",
                })
            };

            const validaCpf = await clienteModel.checkCpf(cpf);

            if (validaCpf > 0) {
                return res.status(409).json({
                    message: 'Erro, esse cpf ja existe'
                })
            }

            const clienteAtual = await clienteModel.selectById(idCliente);

            if (clienteAtual.length === 0) {
                return res.status(200).json({
                    message: 'Cliente não localizado'
                });
            };

            const novoNome = nome ?? clienteAtual[0].nome
            const novoCpf = cpf ?? clienteAtual[0].cpf

            const resultUpdate = await clienteModel.update(idCliente, novoNome, novoCpf);
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
    // /**
    //  * Deleta o registro de clientes no banco de dados
    //  * Rota DELETE /clientes
    //  * @async
    //  * @function deletaCliente
    //  * @param {Request} req Objeto da requisição http
    //  * @param {Response} res Objeto da resposta http
    //  * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
    //  */
    deletaCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const clienteSelecionado = await clienteModel.selectById(idCliente);
            if (clienteSelecionado.length === 0) {
                return res.status(200).json({
                    message: 'Cliente não localizado na base de dados'
                });
            }

            const resultadoDelete = await clienteModel.delete(idCliente);
            if (resultadoDelete.affectedRows === 0) {
                return res.status(200).json({
                    message: 'Ocorreu um erro ao excluir o cliente'
                });
            }

            res.status(200).json({
                message: 'Cliente excluido com sucesso'
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

module.exports = { clienteController };