const { pool } = require('../config/db');

// conceito de transactions, onde ou tudo dá certo "commit" ou se algo der errado "rollback"

const pedidoModel = {
    insertPedidos: async (pIdCliente, pValorPedido, pDataPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // insert 1 - tabela pedidos
            const sqlPedido = 'INSERT INTO pedidos (id_cliente, valor_pedido, data_pedido) VALUES (?, ?, ?);';
            const valuesPedidos = [pIdCliente, pValorPedido, pDataPedido]
            const [rowsPedidos] = await connection.query(sqlPedido, valuesPedidos);

            // insert 2 - tabela itens_pedidos
            const sqlItem = 'INSERT INTO itens_pedidos (id_pedido, id_produto, quantidade, valor_item) VALUES (?, ?, ?, ?);';
            const valuesItem = [rowsPedidos.insertId, pIdProduto, pQuantidadeItem, pValorItem];
            const [rowsItem] = await connection.query(sqlItem, valuesItem);

            // commit (Tudo deu certo, mandando para o banco)
            connection.commit();
            return { rowsPedidos, rowsItem };
        } catch (error) {
            // caso algum insert de erro, ele da rollback e cancela tudo
            connection.rollback();
            throw error;

        }
    },

    selectItemById: async (pIdItem) => {
        const sql = 'SELECT id_item FROM itens_pedidos WHERE id_item = ?;';
        const values = [pIdItem];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    // inserir itens depois da criação do pedido
    insertItem: async (pIdPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // itens_pedidos
            const sqlItem = 'INSERT INTO itens_pedidos (id_pedido, id_produto, quantidade, valor_item) VALUES (?, ?, ?, ?);';
            const valuesItem = [pIdPedido, pIdProduto, pQuantidadeItem, pValorItem];
            const [rowsItem] = await connection.query(sqlItem, valuesItem);

            const sqlPedido = 'UPDATE pedidos SET valor_pedido = valor_pedido + (? * ?) WHERE id_pedido = ?;';
            const valuesPedido = [pQuantidadeItem, pValorItem, pIdPedido]
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido)

            connection.commit();
            return { rowsItem, rowsPedido }
        } catch (error) {
            // caso algum insert de erro, ele da rollback e cancela tudo
            connection.rollback();
            throw error;
        }
    },

    updateQtdItem: async (pIdItem, pQuantidadeItem) => {
        const sql = 'UPDATE itens_pedidos SET quantidade = ? WHERE id_item = ?;';
        const values = [pQuantidadeItem, pIdItem];
        const [rows] = await pool.query(sql,values);
        return rows;
    },

    deleteItem: async (pIdPedido, pIdItem) => {
        const sql = 'DELETE FROM itens_pedidos WHERE id_item = ? AND id_pedido = ?;';
        const values = [pIdItem, pIdPedido];
        const [rows] = await pool.query(sql,values);
        return rows
    }
};

module.exports = { pedidoModel }