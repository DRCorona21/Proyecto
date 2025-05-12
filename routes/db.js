const mysql = require('mysql2/promise');

async function getConnection() {
    const connectionConfigs = [{
        host: '127.0.0.1',
        user: 'root',
        password: 'Pix3lif',
        database: 'CONCESIONARIA'
    }];

    for (const config of connectionConfigs) {
        try {
            const connection = await mysql.createConnection(config);
            return connection;
        } catch (err) {
            console.error(`Error al obtener la conexión con el usuario ${config.user}:`, err);
        }
    }

    throw new Error('No se pudo obtener la conexión a la base de datos con ninguno de los usuarios.');
}

async function closeConnection(connection) {
    if (connection) {
        try {
            await connection.end();
        } catch (err) {
            console.error('Error al cerrar la conexión a la base de datos:', err);
        }
    }
}

module.exports = {
    getConnection,
    closeConnection
};