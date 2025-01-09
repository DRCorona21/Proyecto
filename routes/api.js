const express = require('express');
const { getConnection, closeConnection } = require('./db');
const router = express.Router();

// Obtener todas las direcciones
router.get('/direccion', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT DIRECCION.ID, ESTADO, ALC_MUN, COLONIA, CP, CALLE, NO_INT, NO_EXT
            FROM DIRECCION
            JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
            JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
            ORDER BY DIRECCION.ID ASC
        `);
        res.render('direccion', { data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener una dirección por ID
router.get('/direccion/:id', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const direccion_id = req.params.id;
        const result = await connection.execute(`
            SELECT DIRECCION.ID, DIRECCION.ESTADO_ID, DIRECCION.ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT
            FROM DIRECCION
            WHERE DIRECCION.ID = :direccion_id
        `, { direccion_id });

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Dirección no encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los vehículos
router.get('/vehiculo', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT 
                VEHICULO.ID_V,
                VEHICULO.VIN,
                MARCA.MARCA,
                MODELO.MODELO,
                VEHICULO.ANIO,
                COLOR.COLOR,
                TIPO.TIPO,
                VEHICULO.LINEA,
                TRANSMISION.TIPO AS TRANSMISION,
                VEHICULO.PRECIO,
                ESTADO_V.ESTADO,
                VEHICULO.FECHA_INGRESO,
                VEHICULO.NUM_MOTOR,
                TIPO_MOTOR.TIPO AS TIPO_MOTOR,
                VEHICULO.CAPACIDAD,
                VEHICULO.NUM_CILINDROS,
                VEHICULO.NUM_PUERTAS,
                PROVEEDOR.EMPRESA AS PROVEEDOR
            FROM VEHICULO
            JOIN MARCA ON VEHICULO.MARCA_ID = MARCA.ID
            JOIN MODELO ON VEHICULO.MODELO_ID = MODELO.ID
            JOIN COLOR ON VEHICULO.COLOR_ID = COLOR.ID
            JOIN TIPO ON VEHICULO.TIPO_ID = TIPO.ID
            JOIN TRANSMISION ON VEHICULO.TRANSMISION_ID = TRANSMISION.ID
            JOIN ESTADO_V ON VEHICULO.ESTADO_V_ID = ESTADO_V.ID
            JOIN TIPO_MOTOR ON VEHICULO.TIPO_MOTOR_ID = TIPO_MOTOR.ID
            JOIN PROVEEDOR ON VEHICULO.PROVEEDOR_ID_FK = PROVEEDOR.ID_P
            ORDER BY VEHICULO.ID_V ASC
        `);
        res.render('vehiculos', { data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener colores coloridos
router.get('/colores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`SELECT * FROM COLOR ORDER BY ID ASC`);
        res.render('colores', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener modelos modelados 
router.get('/modelos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT MODELO.ID, MODELO.MODELO, MARCA.MARCA, MODELO.MARCA_ID
            FROM MODELO 
            JOIN MARCA ON MODELO.MARCA_ID = MARCA.ID
            ORDER BY MODELO.ID ASC
        `);
        res.render('modelos', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los modelos por marca
router.get('/modelos/:marca_id', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const marca_id = req.params.marca_id;
        const result = await connection.execute(`SELECT ID, MODELO FROM MODELO WHERE MARCA_ID = :marca_id ORDER BY ID ASC`, { marca_id });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los colores
router.get('/colores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, COLOR FROM COLOR ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los colores para el select
router.get('/coloresSelect', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, COLOR FROM COLOR ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener metodos metodicos 
router.get('/metodos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT * FROM METODO_PAGO ORDER BY ID ASC
        `);
        res.render('metodos', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener marcas
router.get('/marca', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT * FROM MARCA ORDER BY ID ASC
        `);
        res.render('marca', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todas las marcas para el select
router.get('/marcasSelect', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, MARCA FROM MARCA ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener garantias
router.get('/garantia', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT * FROM TIPO_GARANTIA ORDER BY ID ASC
        `);
        res.render('garantia', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener cargos
router.get('/cargos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT * FROM CARGO_EMPLEADO ORDER BY ID ASC
        `);
        res.render('cargos', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener contaco empleados
router.get('/contacto_empleado', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT * FROM CONTACTO_EMPLEADO ORDER BY ID ASC
        `);
        res.render('contacto_empleado', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los estados
router.get('/estados', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`SELECT ID, ESTADO FROM ESTADO ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los municipios
router.get('/municipios', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`SELECT ID, ALC_MUN FROM ALC_MUN ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todas las marcas
router.get('/marcas', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, MARCA FROM MARCA ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los tipos de vehículos
router.get('/tipos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, TIPO FROM TIPO ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todas las transmisiones
router.get('/transmisiones', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, TIPO FROM TRANSMISION ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los estados de vehículos
router.get('/estados_vehiculo', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, ESTADO FROM ESTADO_V ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los tipos de motores
router.get('/tipos_motor', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID, TIPO FROM TIPO_MOTOR ORDER BY ID ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los proveedores
router.get('/proveedores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT ID_P, EMPRESA FROM PROVEEDOR ORDER BY ID_P ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener el ID máximo de modelos
router.get('/modelos/maxId', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT MAX(ID) AS MAX_ID FROM MODELO`);
        const maxId = result.rows[0].MAX_ID;
        console.log('ID máximo obtenido:', maxId, 'Tipo:', typeof maxId);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el ID máximo');
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;