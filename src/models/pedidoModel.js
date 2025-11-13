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
            connection.rollback
            throw error;

        }
    },

    // inserir itens depois da criação do pedido
    insertItem: async (pIdPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        // itens_pedidos
        const sqlItem = 'INSERT INTO itens_pedidos (id_pedido, id_produto, quantidade, valor_item) VALUES (?, ?, ?, ?);';
        const valuesItem = [pIdPedido, pIdProduto, pQuantidadeItem, pValorItem];
        const [rowsItem] = await pool.query(sqlItem, valuesItem);

        if (rowsItem.insertId !== 0) {
            updatePedido(pValorPedido, pIdPedido)
        }
        return rowsItem;
    },

    updatePedido: async (pIdPedido, pValorPedido) => {
        // itens_pedidos
        const sql = 'UPDATE pedidos SET valor_pedido = ? WHERE id_pedido = ?;';
        const values = [pValorPedido, pIdPedido];
        const [rows] = await pool.query(sql, values);
        return { rows };
    }
};

module.exports = { pedidoModel }