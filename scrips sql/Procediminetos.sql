CREATE OR REPLACE PROCEDURE P_VENTASXTRANSMISION (CURSOR_TRANSMISION OUT SYS_REFCURSOR)IS
BEGIN
    OPEN CURSOR_TRANSMISION FOR
    SELECT TIPO, COUNT(TIPO) AS CANTIDAD_VENTAS
    FROM TRANSMISION
    JOIN VEHICULO ON TRANSMISION.ID = VEHICULO.TRANSMISION_ID
    JOIN DETALLE_VENTA ON VEHICULO.ID_V = DETALLE_VENTA.VEHICULO_ID_V
    JOIN VENTA ON DETALLE_VENTA.VENTA_CLAVE = VENTA.CLAVE 
    GROUP BY TIPO;
END;
/

SET SERVEROUTPUT ON;

DECLARE
PRINT_TRANSMISION SYS_REFCURSOR;
TIPO VARCHAR2(50);
CANTIDAD_VENDIDAS NUMBER;
BEGIN
P_VENTASXTRANSMISION(PRINT_TRANSMISION);
LOOP
FETCH PRINT_TRANSMISION INTO TIPO, CANTIDAD_VENDIDAS;
EXIT WHEN PRINT_TRANSMISION%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('TIPO: ' || TIPO || ', CANTIDAD VENDIDAS: ' || CANTIDAD_VENDIDAS);
END LOOP;
CLOSE PRINT_TRANSMISION;
END;
/

CREATE OR REPLACE PROCEDURE P_MAX_VENTAS_CONCESIONARIA (CURSOR_RESULTADO OUT SYS_REFCURSOR)IS
BEGIN
    OPEN CURSOR_RESULTADO FOR
    SELECT NOMBRE, ESTADO, ALC_MUN, COLONIA, CP, COUNT(VENTA.CLAVE) AS CANTIDAD_VENTAS
    FROM CONCESIONARIA
    JOIN VENTA ON CONCESIONARIA.CLAVE = VENTA.CONCESIONARIA_CLAVE
    JOIN DIRECCION ON DIRECCION.ID = CONCESIONARIA.DIRECCION_ID
    JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
    JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
    GROUP BY NOMBRE, ESTADO, ALC_MUN, COLONIA, CP
    HAVING COUNT(VENTA.CLAVE) = (
        SELECT MAX(CANTIDAD_VENTAS)
        FROM (
            SELECT COUNT(VENTA.CLAVE) AS CANTIDAD_VENTAS
            FROM CONCESIONARIA
            JOIN VENTA ON CONCESIONARIA.CLAVE = VENTA.CONCESIONARIA_CLAVE
            JOIN DIRECCION ON DIRECCION.ID = CONCESIONARIA.DIRECCION_ID
            JOIN ESTADO ON DIRECCION.ESTADO_ID = ESTADO.ID
            JOIN ALC_MUN ON DIRECCION.ALC_MUN_ID = ALC_MUN.ID
            GROUP BY NOMBRE, ESTADO, ALC_MUN, COLONIA, CP
        )
    );
END;
/
DECLARE
    CURSOR_OUT SYS_REFCURSOR;
    NOMBRE_CONCESIONARIA VARCHAR2(100);
    ESTADO_NOMBRE VARCHAR2(100);
    ALCALDIA_MUNICIPIO VARCHAR2(100);
    COLONIA_NOMBRE VARCHAR2(100);
    CODIGO_POSTAL VARCHAR2(20);
    CANTIDAD_VENTAS NUMBER;
BEGIN
    P_MAX_VENTAS_CONCESIONARIA(CURSOR_OUT);
    LOOP
    FETCH CURSOR_OUT INTO NOMBRE_CONCESIONARIA, ESTADO_NOMBRE, ALCALDIA_MUNICIPIO,
    COLONIA_NOMBRE, CODIGO_POSTAL, CANTIDAD_VENTAS;
    EXIT WHEN CURSOR_OUT%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE('NOMBRE: ' || NOMBRE_CONCESIONARIA ||', ESTADO: ' || ESTADO_NOMBRE ||
    ', ALC/MUN: ' || ALCALDIA_MUNICIPIO ||', COLONIA: ' || COLONIA_NOMBRE ||
    ', CP: ' || CODIGO_POSTAL ||', CANTIDAD DE VENTAS: ' || CANTIDAD_VENTAS);
    END LOOP;
    CLOSE CURSOR_OUT;
END;
/
CREATE OR REPLACE PROCEDURE P_MAXVENTASXEMPLEADO (CURSOR_RESULTADO OUT SYS_REFCURSOR)IS
BEGIN
    OPEN CURSOR_RESULTADO FOR
    SELECT NOMBRE, COUNT(VENTA.CLAVE) AS CANTIDAD
    FROM EMPLEADO
    JOIN VENTA ON VENTA.EMPLEADO_ID_E = EMPLEADO.ID_E
    GROUP BY NOMBRE
    HAVING COUNT(VENTA.CLAVE) = (
        SELECT MAX(CANTIDAD)
        FROM (
            SELECT COUNT(VENTA.CLAVE) AS CANTIDAD
            FROM EMPLEADO
            JOIN VENTA ON VENTA.EMPLEADO_ID_E = EMPLEADO.ID_E
            GROUP BY NOMBRE
        )
    );
END;
/

DECLARE
    CURSOR_OUT SYS_REFCURSOR;
    NOMBRE_EMPLEADO VARCHAR2(100);
    CANTIDAD_VENTAS NUMBER;
BEGIN
    P_MAXVENTASXEMPLEADO(CURSOR_OUT);
    LOOP
        FETCH CURSOR_OUT INTO NOMBRE_EMPLEADO, CANTIDAD_VENTAS;
        EXIT WHEN CURSOR_OUT%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('NOMBRE: ' || NOMBRE_EMPLEADO || ', CANTIDAD DE VENTAS: ' || CANTIDAD_VENTAS);
    END LOOP;
    CLOSE CURSOR_OUT;
END;
/
CREATE OR REPLACE PROCEDURE P_GANANCIAS_MENSUALES (MES IN NUMBER, CURSOR_RESULTADO OUT SYS_REFCURSOR 
)
IS
BEGIN
    OPEN CURSOR_RESULTADO FOR
    SELECT 
        EXTRACT(MONTH FROM FECHA_VENTA) AS MONTH, 
        SUM(MONTO_METODO) AS GANANCIAS_T
    FROM DETALLE_PAGO
    JOIN VENTA ON VENTA.CLAVE = DETALLE_PAGO.VENTA_CLAVE
    WHERE EXTRACT(MONTH FROM FECHA_VENTA) = MES
    GROUP BY EXTRACT(MONTH FROM FECHA_VENTA)
    ORDER BY EXTRACT(MONTH FROM FECHA_VENTA) ASC;
END;
/
DECLARE
    CURSOR_OUT SYS_REFCURSOR;
    MES_NUMERO NUMBER := 11; -- Aqui ingresamos el paramtro de entrada, en este caso el mes
    MES_RESULTADO NUMBER;
    GANANCIAS NUMBER;
BEGIN
    P_GANANCIAS_MENSUALES(MES_NUMERO, CURSOR_OUT);

    LOOP
        FETCH CURSOR_OUT INTO MES_RESULTADO, GANANCIAS;
        EXIT WHEN CURSOR_OUT%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('MES: ' || MES_RESULTADO || ', GANANCIAS TOTALES: ' || GANANCIAS);
    END LOOP;
    CLOSE CURSOR_OUT;
END;
/
CREATE OR REPLACE PROCEDURE P_METODO_MAS_UTILIZADO (CURSOR_RESULTADO OUT SYS_REFCURSOR)IS
BEGIN
    OPEN CURSOR_RESULTADO FOR
    SELECT METODO, COUNT(METODO_PAGO_ID) AS TOTAL
    FROM METODO_PAGO
    JOIN DETALLE_PAGO ON METODO_PAGO.ID = DETALLE_PAGO.METODO_PAGO_ID
    GROUP BY METODO
    HAVING COUNT(METODO_PAGO_ID) = (
        SELECT MAX(TOTAL)
        FROM (
            SELECT COUNT(METODO_PAGO_ID) AS TOTAL
            FROM METODO_PAGO
            JOIN DETALLE_PAGO ON METODO_PAGO.ID = DETALLE_PAGO.METODO_PAGO_ID
            GROUP BY METODO
        )
    );
END;
/
DECLARE
    CURSOR_OUT SYS_REFCURSOR;
    METODO_PAGO VARCHAR2(100);
    TOTAL_USOS NUMBER;
BEGIN
    P_METODO_MAS_UTILIZADO(CURSOR_OUT);
    LOOP
        FETCH CURSOR_OUT INTO METODO_PAGO, TOTAL_USOS;
        EXIT WHEN CURSOR_OUT%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('MÉTODO DE PAGO: ' || METODO_PAGO || ', TOTAL DE USOS: ' || TOTAL_USOS);
    END LOOP;
    CLOSE CURSOR_OUT;
END;
/
CREATE OR REPLACE PROCEDURE P_DETALLE_VEHICULO (VIN_IN IN VARCHAR2,
    CURSOR_RESULTADO OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN CURSOR_RESULTADO FOR
    SELECT VEHICULO.VIN, MARCA.MARCA, MODELO.MODELO, VEHICULO.ANIO, COLOR.COLOR, TIPO.TIPO, VEHICULO.LINEA, TRANSMISION.TIPO AS TRANSMISION, VEHICULO.PRECIO,
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
    WHERE VEHICULO.VIN = VIN_IN;
END;
/

DECLARE
    CURSOR_OUT SYS_REFCURSOR;
    VIN_RESULTADO VARCHAR2(50);
    MARCA_RESULTADO VARCHAR2(100);
    MODELO_RESULTADO VARCHAR2(100);
    ANIO_RESULTADO NUMBER;
    COLOR_RESULTADO VARCHAR2(50);
    TIPO_RESULTADO VARCHAR2(50);
    LINEA_RESULTADO VARCHAR2(100);
    TRANSMISION_RESULTADO VARCHAR2(50);
    PRECIO_RESULTADO NUMBER;
    ESTADO_RESULTADO VARCHAR2(50);
    FECHA_INGRESO_RESULTADO DATE;
    NUM_MOTOR_RESULTADO VARCHAR2(100);
    TIPO_MOTOR_RESULTADO VARCHAR2(50);
    CAPACIDAD_RESULTADO NUMBER;
    NUM_CILINDROS_RESULTADO NUMBER;
    NUM_PUERTAS_RESULTADO NUMBER;
    PROVEEDOR_RESULTADO VARCHAR2(100);
    FECHA_VENTA_RESULTADO DATE;
    FECHA_ENTREGA_RESULTADO DATE;
    NO_FACTURA_RESULTADO VARCHAR2(50);
    NOMBRE_CLIENTE_RESULTADO VARCHAR2(100);
    NOMBRE_EMPLEADO_RESULTADO VARCHAR2(100);
    NOMBRE_CONCESIONARIA_RESULTADO VARCHAR2(100);
    PAGINA_WEB_RESULTADO VARCHAR2(100);
    RFC_RESULTADO VARCHAR2(50);
    GARANTIA_RESULTADO VARCHAR2(50);
    METODO_RESULTADO VARCHAR2(50);
BEGIN
    P_DETALLE_VEHICULO('1HGBH41JXMN109186', CURSOR_OUT);
    LOOP
        FETCH CURSOR_OUT INTO VIN_RESULTADO, MARCA_RESULTADO, MODELO_RESULTADO, ANIO_RESULTADO, COLOR_RESULTADO, TIPO_RESULTADO, LINEA_RESULTADO,
                             TRANSMISION_RESULTADO, PRECIO_RESULTADO, ESTADO_RESULTADO, FECHA_INGRESO_RESULTADO, NUM_MOTOR_RESULTADO, TIPO_MOTOR_RESULTADO,
                             CAPACIDAD_RESULTADO, NUM_CILINDROS_RESULTADO, NUM_PUERTAS_RESULTADO, PROVEEDOR_RESULTADO, FECHA_VENTA_RESULTADO, FECHA_ENTREGA_RESULTADO,
                             NO_FACTURA_RESULTADO, NOMBRE_CLIENTE_RESULTADO, NOMBRE_EMPLEADO_RESULTADO, NOMBRE_CONCESIONARIA_RESULTADO, PAGINA_WEB_RESULTADO,
                             RFC_RESULTADO, GARANTIA_RESULTADO, METODO_RESULTADO;
        EXIT WHEN CURSOR_OUT%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('VIN: ' || VIN_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('MARCA: ' || MARCA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('MODELO: ' || MODELO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('AÑO: ' || ANIO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('COLOR: ' || COLOR_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('TIPO: ' || TIPO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('LÍNEA: ' || LINEA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('TRANSMISIÓN: ' || TRANSMISION_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('PRECIO: ' || PRECIO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('ESTADO: ' || ESTADO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('FECHA DE INGRESO: ' || FECHA_INGRESO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('NÚMERO DE MOTOR: ' || NUM_MOTOR_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('TIPO DE MOTOR: ' || TIPO_MOTOR_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('CAPACIDAD: ' || CAPACIDAD_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('NÚMERO DE CILINDROS: ' || NUM_CILINDROS_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('NÚMERO DE PUERTAS: ' || NUM_PUERTAS_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('PROVEEDOR: ' || PROVEEDOR_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('FECHA DE VENTA: ' || FECHA_VENTA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('FECHA DE ENTREGA: ' || FECHA_ENTREGA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('NÚMERO DE FACTURA: ' || NO_FACTURA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('CLIENTE: ' || NOMBRE_CLIENTE_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('EMPLEADO: ' || NOMBRE_EMPLEADO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('CONCESIONARIA: ' || NOMBRE_CONCESIONARIA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('PÁGINA WEB: ' || PAGINA_WEB_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('RFC: ' || RFC_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('GARANTÍA: ' || GARANTIA_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('MÉTODO DE PAGO: ' || METODO_RESULTADO);
        DBMS_OUTPUT.PUT_LINE('-----------------------------------------------');
    END LOOP;
    CLOSE CURSOR_OUT;
END;
/


