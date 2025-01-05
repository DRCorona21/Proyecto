const express = require('express');
const { getConnection, closeConnection } = require('./db');
const router = express.Router();

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
            res.status(400).send('Error: El ID ya existe en la base de datos.');
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

module.exports = router;