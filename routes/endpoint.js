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
router.post('/direccion', async(req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const { direccion_id, estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext } = req.body;

        // Verificar si el ID ya existe
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM DIRECCION WHERE ID = :direccion_id`, { direccion_id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT) VALUES (:direccion_id, :estado_id, :alc_mun_id, :colonia, :cp, :calle, :no_int, :no_ext)`, { direccion_id, estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM DIRECCION WHERE ID = :direccion_id`, { direccion_id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE DIRECCION SET ESTADO_ID = :estado_id, ALC_MUN_ID = :alc_mun_id, COLONIA = :colonia, CP = :cp, CALLE = :calle, NO_INT = :no_int, NO_EXT = :no_ext WHERE ID = :direccion_id`, { estado_id, alc_mun_id, colonia, cp, calle, no_int, no_ext, direccion_id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM VEHICULO WHERE ID_V = :id_v`, { id_v }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK) 
            VALUES (:id_v, :vin, :marca_id, :modelo_id, :anio, :color_id, :tipo_id, :linea, :transmision_id, :precio, :estado_v_id, TO_DATE(:fecha_ingreso, 'YYYY-MM-DD'), :num_motor, :tipo_motor_id, :capacidad, :num_cilindros, :num_puertas, :proveedor_id_fk)`, { id_v, vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM VEHICULO WHERE ID_V = :id_v`, { id_v }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE VEHICULO SET VIN = :vin, MARCA_ID = :marca_id, MODELO_ID = :modelo_id, ANIO = :anio, COLOR_ID = :color_id, TIPO_ID = :tipo_id, LINEA = :linea, TRANSMISION_ID = :transmision_id, PRECIO = :precio, ESTADO_V_ID = :estado_v_id, FECHA_INGRESO = TO_DATE(:fecha_ingreso, 'YYYY-MM-DD'), NUM_MOTOR = :num_motor, TIPO_MOTOR_ID = :tipo_motor_id, CAPACIDAD = :capacidad, NUM_CILINDROS = :num_cilindros, NUM_PUERTAS = :num_puertas, PROVEEDOR_ID_FK = :proveedor_id_fk WHERE ID_V = :id_v`, { vin, marca_id, modelo_id, anio, color_id, tipo_id, linea, transmision_id, precio, estado_v_id, fecha_ingreso, num_motor, tipo_motor_id, capacidad, num_cilindros, num_puertas, proveedor_id_fk, id_v }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM COLOR WHERE ID = :ID`, { ID }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO COLOR (ID, COLOR) VALUES (:ID, :COLOR)`, { ID, COLOR }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM COLOR WHERE ID = :ID`, { ID }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE COLOR SET COLOR = :color WHERE ID = :ID`, { color, ID }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM MODELO WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO MODELO (ID, MODELO, MARCA_ID) VALUES (:id, :modelo, :marca_id)`, { id, modelo, marca_id }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM MODELO WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE MODELO SET MODELO = :modelo, MARCA_ID = :marca_id WHERE ID = :id`, { modelo, marca_id, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM METODO_PAGO WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO METODO_PAGO (ID, METODO) VALUES (:id, :metodo)`, { id, metodo }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM METODO_PAGO WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE METODO_PAGO SET METODO = :metodo WHERE ID = :id`, { metodo, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM MARCA WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO MARCA (ID, MARCA) VALUES (:id, :marca)`, { id, marca }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM MARCA WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE MARCA SET MARCA = :marca WHERE ID = :id`, { marca, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM TIPO_GARANTIA WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO TIPO_GARANTIA (ID, GARANTIA) VALUES (:id, :garantia)`, { id, garantia }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM TIPO_GARANTIA WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE TIPO_GARANTIA SET GARANTIA = :garantia WHERE ID = :id`, { garantia, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM CARGO_EMPLEADO WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO CARGO_EMPLEADO (ID, CARGO) VALUES (:id, :cargo)`, { id, cargo }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM CARGO_EMPLEADO WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE CARGO_EMPLEADO SET CARGO = :cargo WHERE ID = :id`, { cargo, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM CONTACTO_EMPLEADO WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO CONTACTO_EMPLEADO (ID, CORREO, TELEFONO) VALUES (:id, :correo, :telefono)`, { id, correo, telefono }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM CONTACTO_EMPLEADO WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE CONTACTO_EMPLEADO SET CORREO = :correo, TELEFONO = :telefono WHERE ID = :id`, { correo, telefono, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM TRANSMISION WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO TRANSMISION (ID, TIPO) VALUES (:id, :tipo)`, { id, tipo }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM TRANSMISION WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE TRANSMISION SET TIPO = :tipo WHERE ID = :id`, { tipo, id }, { autoCommit: true }
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
        const checkResult = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM TIPO_MOTOR WHERE ID = :id`, { id }
        );

        if (checkResult.rows[0].COUNT > 0) {
            res.send(res.locals.showAlert('Error: El ID ya existe en la base de datos.'));
            return;
        }

        await connection.execute(
            `INSERT INTO TIPO_MOTOR (ID, TIPO) VALUES (:id, :tipo)`, { id, tipo }, { autoCommit: true }
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

        await connection.execute(
            `DELETE FROM TIPO_MOTOR WHERE ID = :id`, { id }, { autoCommit: true }
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

        await connection.execute(
            `UPDATE TIPO_MOTOR SET TIPO = :tipo WHERE ID = :id`, { tipo, id }, { autoCommit: true }
        );

        res.redirect('/api/motores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los datos');
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;