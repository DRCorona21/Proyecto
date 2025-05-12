const express = require('express');
const { getConnection, closeConnection } = require('./db');
const router = express.Router();

// Middleware to handle error messages
router.use((req, res, next) => {
    res.locals.showAlert = function(message) {
        return `<script>alert('${message}'); window.history.back();</script>`;
    };
    next();
});

// Insertar una nueva dirección
router.post('/direccion', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { direccion_id, estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM DIRECCION WHERE ID = ?`, [direccion_id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [direccion_id, estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext]
        );

        res.redirect('/api/direccion');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar una dirección
router.post('/direccion/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const direccion_id = req.params.id;

        console.log(`Eliminando registro con ID: ${direccion_id}`);

        await connection.query(
            `DELETE FROM DIRECCION WHERE ID = ?`, [direccion_id]
        );

        res.redirect('/api/direccion');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar una dirección
router.post('/direccion/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext } = req.body;
        const direccion_id = req.params.id;

        console.log(`Actualizando registro con ID: ${direccion_id}`);
        console.log(`Datos recibidos: ${JSON.stringify(req.body)}`);

        if (!estado_id || !alc_mun_id || !colonia || !cp || !calle || !no_ext) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE DIRECCION SET ESTADO_ID = ?, ALC_MUN_ID = ?, COLONIA = ?, CP = ?, CALLE = ?, NO_INT = ?, NO_EXT = ? WHERE ID = ?`,
            [estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext, direccion_id]
        );

        res.redirect('/api/direccion');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});
//Endpoints de vehiculos

// Insertar un nuevo vehículo
router.post('/vehiculo', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id_v, vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM VEHICULO WHERE ID_V = ?`, [id_v]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, ?, ?, ?, ?)`,
            [id_v, vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk]
        );

        res.redirect('/api/vehiculo');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un vehículo
router.post('/vehiculo/:id_v/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id_v = req.params.id_v;

        await connection.query(
            `DELETE FROM VEHICULO WHERE ID_V = ?`, [id_v]
        );

        res.redirect('/api/vehiculo');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un vehículo
router.post('/vehiculo/:id_v/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk } = req.body;
        const id_v = req.params.id_v;

        await connection.query(
            `UPDATE VEHICULO SET VIN = ?, MARCA_ID = ?, MODELO_ID = ?, ANIO = ?, COLOR_ID = ?, TIPO_ID = ?, LINEA = ?, TRANSMISION_ID = ?, PRECIO = ?, ESTADO_V_ID = ?, FECHA_INGRESO = STR_TO_DATE(?, '%Y-%m-%d'), NUM_MOTOR = ?, TIPO_MOTOR_ID = ?, CAPACIDAD = ?, NUM_CILINDROS = ?, NUM_PUERTAS = ?, PROVEEDOR_ID_FK = ? WHERE ID_V = ?`,
            [vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk, id_v]
        );

        res.redirect('/api/vehiculo');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

//ENDSPOINT COLORES

// Insertar una nuevo color
router.post('/colores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { ID, COLOR } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM COLOR WHERE ID = ?`, [ID]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO COLOR (ID, COLOR) VALUES (?, ?)`, [ID, COLOR]
        );

        res.redirect('/api/colores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un color
router.post('/colores/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const ID = req.params.id;

        console.log(`Eliminando registro con ID: ${ID}`);

        await connection.query(
            `DELETE FROM COLOR WHERE ID = ?`, [ID]
        );

        res.redirect('/api/colores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un color
router.post('/colores/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { color } = req.body; //segun final .EJS
        const ID = req.params.id;

        console.log(`Actualizando registro con ID: ${ID}`);
        console.log(`Datos recibidos: ${JSON.stringify(req.body)}`);

        if (!color) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE COLOR SET COLOR = ? WHERE ID = ?`, [color, ID]
        );

        res.redirect('/api/colores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo modelo
router.post('/modelos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, modelo, marca_id } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM MODELO WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO MODELO (ID, MODELO, MARCA_ID) VALUES (?, ?, ?)`, [id, modelo, marca_id]
        );

        res.redirect('/api/modelos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un modelo
router.post('/modelos/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM MODELO WHERE ID = ?`, [id]
        );

        res.redirect('/api/modelos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un modelo
router.post('/modelos/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { modelo, marca_id } = req.body;
        const id = req.params.id;

        if (!modelo || !marca_id) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE MODELO SET MODELO = ?, MARCA_ID = ? WHERE ID = ?`, [modelo, marca_id, id]
        );

        res.redirect('/api/modelos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo método de pago
router.post('/metodos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, metodo } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM METODO_PAGO WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO METODO_PAGO (ID, METODO) VALUES (?, ?)`, [id, metodo]
        );

        res.redirect('/api/metodos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un método de pago
router.post('/metodos/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM METODO_PAGO WHERE ID = ?`, [id]
        );

        res.redirect('/api/metodos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un método de pago
router.post('/metodos/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { metodo } = req.body;
        const id = req.params.id;

        if (!metodo) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE METODO_PAGO SET METODO = ? WHERE ID = ?`, [metodo, id]
        );

        res.redirect('/api/metodos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});


// Insertar una nueva marca
router.post('/marca', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, marca } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM MARCA WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO MARCA (ID, MARCA) VALUES (?, ?)`, [id, marca]
        );

        res.redirect('/api/marca');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar una marca
router.post('/marca/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM MARCA WHERE ID = ?`, [id]
        );

        res.redirect('/api/marca');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar una marca
router.post('/marca/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { marca } = req.body;
        const id = req.params.id;

        if (!marca) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE MARCA SET MARCA = ? WHERE ID = ?`, [marca, id]
        );

        res.redirect('/api/marca');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar una nueva garantía
router.post('/garantia', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, garantia } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM TIPO_GARANTIA WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO TIPO_GARANTIA (ID, GARANTIA) VALUES (?, ?)`, [id, garantia]
        );

        res.redirect('/api/garantia');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar una garantía
router.post('/garantia/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM TIPO_GARANTIA WHERE ID = ?`, [id]
        );

        res.redirect('/api/garantia');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar una garantía
router.post('/garantia/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { garantia } = req.body;
        const id = req.params.id;

        if (!garantia) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE TIPO_GARANTIA SET GARANTIA = ? WHERE ID = ?`, [garantia, id]
        );

        res.redirect('/api/garantia');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo cargo
router.post('/cargos', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, cargo } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM CARGO_EMPLEADO WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO CARGO_EMPLEADO (ID, CARGO) VALUES (?, ?)`, [id, cargo]
        );

        res.redirect('/api/cargos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un cargo
router.post('/cargos/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM CARGO_EMPLEADO WHERE ID = ?`, [id]
        );

        res.redirect('/api/cargos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un cargo
router.post('/cargos/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { cargo } = req.body;
        const id = req.params.id;

        if (!cargo) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE CARGO_EMPLEADO SET CARGO = ? WHERE ID = ?`, [cargo, id]
        );

        res.redirect('/api/cargos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo contacto
router.post('/contacto_empleado', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, correo, telefono } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM CONTACTO_EMPLEADO WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO CONTACTO_EMPLEADO (ID, CORREO, TELEFONO) VALUES (?, ?, ?)`, [id, correo, telefono]
        );

        res.redirect('/api/contacto_empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un contacto
router.post('/contacto_empleado/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM CONTACTO_EMPLEADO WHERE ID = ?`, [id]
        );

        res.redirect('/api/contacto_empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un contacto
router.post('/contacto_empleado/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { correo, telefono } = req.body;
        const id = req.params.id;

        if (!correo || !telefono) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE CONTACTO_EMPLEADO SET CORREO = ?, TELEFONO = ? WHERE ID = ?`, [correo, telefono, id]
        );

        res.redirect('/api/contacto_empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar una nueva transmisión
router.post('/transmisionv2', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, tipo } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM TRANSMISION WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO TRANSMISION (ID, TIPO) VALUES (?, ?)`, [id, tipo]
        );

        res.redirect('/api/transmisionv2');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar una transmisión
router.post('/transmisionv2/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM TRANSMISION WHERE ID = ?`, [id]
        );

        res.redirect('/api/transmisionv2');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar una transmisión
router.post('/transmisionv2/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { tipo } = req.body;
        const id = req.params.id;

        if (!tipo) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE TRANSMISION SET TIPO = ? WHERE ID = ?`, [tipo, id]
        );

        res.redirect('/api/transmisionv2');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo motor
router.post('/motores', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id, tipo } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM TIPO_MOTOR WHERE ID = ?`, [id]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO TIPO_MOTOR (ID, TIPO) VALUES (?, ?)`, [id, tipo]
        );

        res.redirect('/api/motores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un motor
router.post('/motores/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id = req.params.id;

        await connection.query(
            `DELETE FROM TIPO_MOTOR WHERE ID = ?`, [id]
        );

        res.redirect('/api/motores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un motor
router.post('/motores/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { tipo } = req.body;
        const id = req.params.id;

        if (!tipo) {
            res.status(400).send('Error: Todos los campos requeridos deben tener valores.');
            return;
        }

        await connection.query(
            `UPDATE TIPO_MOTOR SET TIPO = ? WHERE ID = ?`, [tipo, id]
        );

        res.redirect('/api/motores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Insertar un nuevo empleado
router.post('/empleado', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { id_e, clave, nombre, apellido_pat, apellido_mat, rfc, fecha_naci, cargo_empleado_id, contacto_empleado_id, direccion_id } = req.body;

        // Verificar si el ID ya existe
        const [checkResult] = await connection.query(
            `SELECT COUNT(*) AS COUNT FROM EMPLEADO WHERE ID_E = ?`, [id_e]
        );

        if (checkResult[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.query(
            `INSERT INTO EMPLEADO (ID_E, CONCESIONARIA_CLAVE, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID) 
            VALUES (?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, ?)`,
            [id_e, clave, nombre, apellido_pat, apellido_mat, rfc, fecha_naci, cargo_empleado_id, contacto_empleado_id, direccion_id]
        );

        res.redirect('/api/empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Eliminar un empleado
router.post('/empleado/:id/delete', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const id_e = req.params.id;

        await connection.query(
            `DELETE FROM EMPLEADO WHERE ID_E = ?`, [id_e]
        );

        res.redirect('/api/empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar los datos');
    } finally {
        await closeConnection(connection);
    }
});

// Actualizar un empleado
router.post('/empleado/:id/update', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { clave, nombre, apellido_pat, apellido_mat, rfc, fecha_naci, cargo_empleado_id, contacto_empleado_id, direccion_id } = req.body;
        const id_e = req.params.id;

        await connection.query(
            `UPDATE EMPLEADO SET CONCESIONARIA_CLAVE = ?, NOMBRE = ?, APELLIDO_PAT = ?, APELLIDO_MAT = ?, RFC = ?, FECHA_NACI = STR_TO_DATE(?, '%Y-%m-%d'), 
            CARGO_EMPLEADO_ID = ?, CONTACTO_EMPLEADO_ID = ?, DIRECCION_ID = ? 
            WHERE ID_E = ?`,
            [clave, nombre, apellido_pat, apellido_mat, rfc, fecha_naci, cargo_empleado_id, contacto_empleado_id, direccion_id, id_e]
        );

        res.redirect('/api/empleado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;