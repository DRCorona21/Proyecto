const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: 'autosadmin',
            password: 'Pix3lif',
            connectString: '127.0.0.1:1521/XEPDB1'
        });
        return connection;
    } catch (err) {
        console.error('Error al obtener la conexión a la base de datos:', err);
        throw err;
    }
}

async function closeConnection(connection) {
    if (connection) {
        try {
            await connection.close();
        } catch (err) {
            console.error('Error al cerrar la conexión a la base de datos:', err);
        }
    }
}

module.exports = {
    getConnection,
    closeConnection
};