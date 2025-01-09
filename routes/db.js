const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
    const connectionConfigs = [{
            user: 'autosadmin',
            password: 'Pix3lif',
            connectString: '127.0.0.1:1521/XEPDB1'
        },
        {
            user: 'USR_ACDD',
            password: 'PassACDD',
            connectString: '127.0.0.1:1521/XEPDB1'
        }
    ];

    for (const config of connectionConfigs) {
        try {
            const connection = await oracledb.getConnection(config);
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