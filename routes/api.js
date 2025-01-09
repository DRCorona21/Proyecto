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

        const result = await connection.execute(`SELECT * FROM VEHICULO`);
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

        const result = await connection.execute(`SELECT * FROM COLOR`);
        res.render('colores', { data: result.rows }); //nombre ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;