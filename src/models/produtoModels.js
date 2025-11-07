const { pool } = require('../config/db');

const produtoModel = {

    /**
     * Retorna todos os produtos cadastrados na tabela produtos
     * @async
     * @function selectAll
     * @returns {Promise<Array<object>>} Retorna um array de objetos, cada objeto representa um produto
     * @example
     * const produtos = await produtoModel.selectAll();
     * console.log(produtos);
     * // Saida esperada
     * [
     *      {coluna1:"ValorColuna1", coluna2:"ValorColuna2", coluna3:"ValorColuna3",}
     * ]
     */
    selectAll: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectById: async (pID) => {
        const sql = "SELECT * FROM produtos WHERE id_produto=?;";
        const values = [pID];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Insere um produto na base de dados
     * @param {string} pNomeProd  Descrição do nome do produto que deve ser inserido no banco de dados. Ex: Teclado
     * @param {number} pValorProd Valor do produto que de ve ser inserido no banco de dados. Ex: 18.99
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades sobre o resultado da execução da query 
     * @example
     * const resultado = await produtoModel.insert(paramA, paramB);
     */
    insert: async (pNomeProd, pValorProd) => {
        const sql = 'INSERT INTO produtos(nome_produto, preco) VALUES (?, ?);';
        const values = [pNomeProd, pValorProd];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    update: async (pId, pDescricao, pValor) => {
        const sql = 'UPDATE produtos SET nome_produto = ?, preco = ? WHERE id_produto = ?;';
        const values = [pNomeProd, pValorProd, pID];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    delete: async (pID) => {
        const sql = 'DELETE FROM produtos WHERE id_produto = ?';
        const values = [pID];
        const [rows] = await pool.query(sql, values);
        return rows;
    }
}

module.exports = { produtoModel }