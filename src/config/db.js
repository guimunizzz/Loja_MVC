const { connect } = require('http2');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'loja_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('conexão com o MYSQL bem sucedida')
        connection.release()
    } catch (error) {
        console.error('erro ao conectar com o banco de dados')
    }
})();

module.exports = { pool };