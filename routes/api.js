const express = require('express');
const { getConnection, closeConnection } = require('./db');
const router = express.Router();

// Obtener todas las direcciones
router.get('/direccion', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT DIRECCION.ID, ESTADO, ALC_MUN, COLONIA, CP, CALLE, NO_INT, NO_EXT
            FROM DIRECCION
            JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
            JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
            ORDER BY DIRECCION.ID ASC
        `);
        res.render('direccion', { data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener una dirección por ID
router.get('/direccion/:id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const direccion_id = req.params.id;
        const [rows] = await connection.query(`
            SELECT DIRECCION.ID, DIRECCION.ESTADO_ID, DIRECCION.ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT
            FROM DIRECCION
            WHERE DIRECCION.ID = ?
        `, [direccion_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
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
router.get('/vehiculo', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
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
        res.render('vehiculos', { data: rows });
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

        const [rows] = await connection.query(`SELECT * FROM COLOR ORDER BY ID ASC`);
        res.render('colores', { data: rows }); //nombre ejs
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

        const [rows] = await connection.query(`
            SELECT MODELO.ID, MODELO.MODELO, MARCA.MARCA, MODELO.MARCA_ID
            FROM MODELO 
            JOIN MARCA ON MODELO.MARCA_ID = MARCA.ID
            ORDER BY MODELO.ID ASC
        `);
        res.render('modelos', { data: rows }); //nombre ejs
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
        const [rows] = await connection.query(`SELECT ID, MODELO FROM MODELO WHERE MARCA_ID = ? ORDER BY ID ASC`, [marca_id]);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, COLOR FROM COLOR ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, COLOR FROM COLOR ORDER BY ID ASC`);
        res.json(rows);
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

        const [rows] = await connection.query(`
            SELECT * FROM METODO_PAGO ORDER BY ID ASC
        `);
        res.render('metodos', { data: rows }); //nombre ejs
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

        const [rows] = await connection.query(`
            SELECT * FROM MARCA ORDER BY ID ASC
        `);
        res.render('marca', { data: rows }); //nombre ejs
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
        const [rows] = await connection.query(`SELECT ID, MARCA FROM MARCA ORDER BY ID ASC`);
        res.json(rows);
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

        const [rows] = await connection.query(`
            SELECT * FROM TIPO_GARANTIA ORDER BY ID ASC
        `);
        res.render('garantia', { data: rows }); //nombre ejs
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

        const [rows] = await connection.query(`
            SELECT * FROM CARGO_EMPLEADO ORDER BY ID ASC
        `);
        res.render('cargos', { data: rows }); //nombre ejs
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

        const [rows] = await connection.query(`
            SELECT * FROM CONTACTO_EMPLEADO ORDER BY ID ASC
        `);
        res.render('contacto_empleado', { data: rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener transmisionesv2
router.get('/transmisionv2', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT * FROM TRANSMISION ORDER BY ID ASC
        `);
        res.render('transmisionv2', { data: rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

//Obtener motoresv2
router.get('/motores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT * FROM TIPO_MOTOR ORDER BY ID ASC
        `);
        res.render('motores', { data: rows }); //nombre ejs
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

        const [rows] = await connection.query(`SELECT ID, ESTADO FROM ESTADO ORDER BY ID ASC`);
        res.json(rows);
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

        const [rows] = await connection.query(`SELECT ID, ALC_MUN FROM ALC_MUN ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, MARCA FROM MARCA ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, TIPO FROM TIPO ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, TIPO FROM TRANSMISION ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, ESTADO FROM ESTADO_V ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID, TIPO FROM TIPO_MOTOR ORDER BY ID ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT ID_P, EMPRESA FROM PROVEEDOR ORDER BY ID_P ASC`);
        res.json(rows);
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
        const [rows] = await connection.query(`SELECT MAX(ID) AS MAX_ID FROM MODELO`);
        const maxId = rows[0].MAX_ID;
        console.log('ID máximo obtenido:', maxId, 'Tipo:', typeof maxId);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el ID máximo');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener detalles de ventas de vehículos
router.get('/ventas', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT VENTA.CLAVE, VEHICULO.VIN, MARCA.MARCA, MODELO.MODELO, VEHICULO.ANIO, COLOR.COLOR, TIPO.TIPO, VEHICULO.LINEA, TRANSMISION.TIPO AS TRANSMISION, VEHICULO.PRECIO,
            ESTADO_V.ESTADO, VEHICULO.FECHA_INGRESO, VEHICULO.NUM_MOTOR, TIPO_MOTOR.TIPO AS TIPO_MOTOR, VEHICULO.CAPACIDAD, VEHICULO.NUM_CILINDROS, VEHICULO.NUM_PUERTAS,
            PROVEEDOR.EMPRESA AS PROVEEDOR, VENTA.FECHA_VENTA, VENTA.FECHA_ENTREGA, VENTA.NO_FACTURA, CLIENTE.NOMBRE AS NOMBRE_CLIENTE, EMPLEADO.NOMBRE AS NOMBRE_EMPLEADO, 
            CONCESIONARIA.NOMBRE AS NOMBRE_CONCESIONARIA, CONCESIONARIA.PAGINA_WEB, CONCESIONARIA.RFC, TIPO_GARANTIA.GARANTIA, METODO_PAGO.METODO
            FROM VEHICULO
            JOIN MARCA ON VEHICULO.MARCA_ID = MARCA.ID
            JOIN MODELO ON VEHICULO.MODELO_ID = MODELO.ID
            JOIN COLOR ON VEHICULO.COLOR_ID = COLOR.ID
            JOIN TIPO ON VEHICULO.TIPO_ID = TIPO.ID
            JOIN TRANSMISION ON VEHICULO.TRANSMISION_ID = TRANSMISION.ID
            JOIN ESTADO_V ON VEHICULO.ESTADO_V_ID = ESTADO_V.ID
            JOIN TIPO_MOTOR ON VEHICULO.TIPO_MOTOR_ID = TIPO_MOTOR.ID
            JOIN PROVEEDOR ON VEHICULO.PROVEEDOR_ID_FK = PROVEEDOR.ID_P
            JOIN DETALLE_VENTA ON VEHICULO.ID_V = DETALLE_VENTA.VEHICULO_ID_V
            JOIN VENTA ON DETALLE_VENTA.VENTA_CLAVE = VENTA.CLAVE
            JOIN CLIENTE ON VENTA.CLIENTE_ID_C = CLIENTE.ID_C
            JOIN EMPLEADO ON VENTA.EMPLEADO_ID_E = EMPLEADO.ID_E
            JOIN CONCESIONARIA ON VENTA.CONCESIONARIA_CLAVE = CONCESIONARIA.CLAVE
            JOIN TIPO_GARANTIA ON VENTA.TIPO_GARANTIA_ID = TIPO_GARANTIA.ID
            JOIN DETALLE_PAGO ON VENTA.CLAVE = DETALLE_PAGO.VENTA_CLAVE
            JOIN METODO_PAGO ON DETALLE_PAGO.METODO_PAGO_ID = METODO_PAGO.ID
            ORDER BY VENTA.CLAVE ASC
        `);
        res.render('ventas', { data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los empleados
router.get('/empleado', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const [rows] = await connection.query(`
            SELECT EMPLEADO.ID_E, DIRECCION.ID, CONCESIONARIA.CLAVE, EMPLEADO.NOMBRE, EMPLEADO.APELLIDO_PAT, EMPLEADO.APELLIDO_MAT, EMPLEADO.RFC, EMPLEADO.FECHA_NACI,
            CARGO_EMPLEADO.CARGO, CONCESIONARIA.NOMBRE AS CONCESIONARIA_NOMBRE,
            CONTACTO_EMPLEADO.CORREO, CONTACTO_EMPLEADO.TELEFONO, ESTADO.ESTADO,
            ALC_MUN.ALC_MUN, DIRECCION.CP, DIRECCION.CALLE, DIRECCION.NO_INT, DIRECCION.NO_EXT 
            FROM EMPLEADO
            JOIN DIRECCION ON EMPLEADO.DIRECCION_ID = DIRECCION.ID
            JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
            JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
            JOIN CONTACTO_EMPLEADO ON EMPLEADO.CONTACTO_EMPLEADO_ID = CONTACTO_EMPLEADO.ID
            JOIN CARGO_EMPLEADO ON EMPLEADO.CARGO_EMPLEADO_ID = CARGO_EMPLEADO.ID
            JOIN CONCESIONARIA ON EMPLEADO.CONCESIONARIA_CLAVE = CONCESIONARIA.CLAVE
            ORDER BY EMPLEADO.ID_E ASC
        `);
        res.render('empleados', { data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener un empleado por ID
router.get('/empleado/:id', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id_e = req.params.id;
        const [rows] = await connection.query(`
            SELECT EMPLEADO.ID_E, DIRECCION.ID, EMPLEADO.APELLIDO_PAT, EMPLEADO.APELLIDO_MAT, EMPLEADO.RFC, EMPLEADO.FECHA_NACI,
            CARGO_EMPLEADO.CARGO, CONTACTO_EMPLEADO.CORREO, CONTACTO_EMPLEADO.TELEFONO, ESTADO.ESTADO,
            ALC_MUN.ALC_MUN, DIRECCION.CP, DIRECCION.CALLE, DIRECCION.NO_INT, DIRECCION.NO_EXT 
            FROM EMPLEADO
            JOIN DIRECCION ON EMPLEADO.DIRECCION_ID = DIRECCION.ID
            JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
            JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
            JOIN CONTACTO_EMPLEADO ON EMPLEADO.CONTACTO_EMPLEADO_ID = CONTACTO_EMPLEADO.ID
            JOIN CARGO_EMPLEADO ON EMPLEADO.CARGO_EMPLEADO_ID = CARGO_EMPLEADO.ID
            WHERE EMPLEADO.ID_E = ?
        `, [id_e]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Empleado no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los datos necesarios para auto-rellenar el formulario de editar empleado
router.get('/empleado/:id/editData', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const id_e = req.params.id;

        const [rows] = await connection.query(`
            SELECT EMPLEADO.ID_E, EMPLEADO.CONCESIONARIA_CLAVE, EMPLEADO.NOMBRE, EMPLEADO.APELLIDO_PAT, EMPLEADO.APELLIDO_MAT, EMPLEADO.RFC, EMPLEADO.FECHA_NACI,
            EMPLEADO.CARGO_EMPLEADO_ID, EMPLEADO.CONTACTO_EMPLEADO_ID, EMPLEADO.DIRECCION_ID
            FROM EMPLEADO
            WHERE EMPLEADO.ID_E = ?
        `, [id_e]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Empleado no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los datos necesarios para auto-rellenar el formulario de editar vehículo
router.get('/vehiculo/:id/editData', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const id_v = req.params.id;

        const [rows] = await connection.query(`
            SELECT VEHICULO.ID_V, VEHICULO.VIN, VEHICULO.MARCA_ID, VEHICULO.MODELO_ID, VEHICULO.ANIO, VEHICULO.COLOR_ID, VEHICULO.TIPO_ID, VEHICULO.LINEA, VEHICULO.TRANSMISION_ID, VEHICULO.PRECIO, VEHICULO.ESTADO_V_ID, VEHICULO.FECHA_INGRESO, VEHICULO.NUM_MOTOR, VEHICULO.TIPO_MOTOR_ID, VEHICULO.CAPACIDAD, VEHICULO.NUM_CILINDROS, VEHICULO.NUM_PUERTAS, VEHICULO.PROVEEDOR_ID_FK
            FROM VEHICULO
            WHERE VEHICULO.ID_V = ?
        `, [id_v]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Vehículo no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los cargos para empleados
router.get('/tofillemp/cargos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query(`SELECT ID, CARGO FROM CARGO_EMPLEADO ORDER BY ID ASC`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todos los contactos para empleados
router.get('/tofillemp/contacto_empleado', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query(`SELECT ID, CORREO FROM CONTACTO_EMPLEADO ORDER BY ID ASC`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todas las direcciones para empleados
router.get('/tofillemp/direccion', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query(`SELECT ID, CALLE FROM DIRECCION ORDER BY ID ASC`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Obtener todas las concesionarias para empleados
router.get('/tofillemp/concesionarias', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query(`SELECT CLAVE, NOMBRE FROM CONCESIONARIA ORDER BY CLAVE ASC`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;