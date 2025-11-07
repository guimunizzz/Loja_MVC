const { pool } = require('../config/db');

const clienteModel = {
    /**
     * Retorna todos os clientes cadastrados na tabela clientes
     * @async
     * @function selectAll
     * @returns {Promise<Array<object>>} Retorna um array de objetos, cada objeto representa um cliente
     * @example
     * const clientes = await produtoModel.selectAll();
     * console.log(clientes);
     * // Saida esperada
     * [
     *      {coluna1:"ValorColuna1", coluna2:"ValorColuna2", coluna3:"ValorColuna3",}
     * ]
     */
    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Retorna apenas o cliente que possui o id especificado
     * @param {number} pId  ID do cliente especificado
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
     * const resultado = await produtoModel.selectById(paramA);
     */
    selectById: async (pId) => {
        const sql = "SELECT * FROM clientes WHERE id_cliente=?;";
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    /**
     * Função de checar o cpf se ele ja existe, para não ter duplicados no banco de dados, retornando um valor booleano se existe outro cpf igual
     * @param {number} pCpfCliente  CPF do cliente especificado
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
     * const checkCPF = await produtoModel.checkCpf(paramA);
     * console.log(checkCPF);
     * // Saida esperada
     * [
     *      0 ou 1
     * ]
     */
    checkCpf: async (pCpfCliente) => {
        const sql = 'SELECT COUNT(*) AS total FROM clientes WHERE cpf_cliente = ?;';
        const values = [pCpfCliente];
        const [rows] = await pool.query(sql, values);
        return rows[0].total
    },
    /**
     * Insere um cliente na base de dados
     * @param {string} pNomeCliente  Nome do cliente a ser inserido na base de dados. Ex: Maria
     * @param {number} pCpfCliente CPF do cliente a ser inserido na base de dados: Ex: 43737581401
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
     * const resultado = await produtoModel.insert(paramA, paramB);
     */
    insert: async (pNomeCliente, pCpfCliente) => {
        const sql = 'INSERT INTO clientes(nome_cliente, cpf_cliente) VALUES (?, ?);';
        const values = [pNomeCliente, pCpfCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    /**
     * Altera um registro de um cliente na base de dados
     * @param {number} pId  ID do cliente
     * @param {string} pNomeCliente  Nome do cliente
     * @param {number} pCpfCliente  CPF do cliente especificado
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
      * const resultado = await produtoModel.update(paramA, paramB, paramC);
     */
    update: async (pId, pNomeCliente, pCpfCliente) => {
        const sql = 'UPDATE clientes SET nome_cliente = ?, cpf_cliente = ? WHERE id_cliente = ?;';
        const values = [pNomeCliente, pCpfCliente, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Deletar um registro de um cliente na base de dados
     * @param {number} pId  ID do cliente
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
      * const resultado = await produtoModel.delete(paramA);
     */
    delete: async (pId) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    }
}

module.exports = { clienteModel }