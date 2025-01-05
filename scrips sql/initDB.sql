ALTER SESSION SET CONTAINER = XEPDB1;

CREATE TABLESPACE TBS_CONCESIONARIA
DATAFILE 'A:\HDD\Escuela\ESIME CU\7mo Semestre\DB\Proyecto\Consesionaria.dbf' 
SIZE 100M 
AUTOEXTEND ON 
NEXT 10M 
MAXSIZE UNLIMITED 
EXTENT MANAGEMENT LOCAL 
SEGMENT SPACE MANAGEMENT AUTO;

CREATE USER autosAdmin 
IDENTIFIED BY Pix3lif 
DEFAULT TABLESPACE TBS_CONCESIONARIA 
QUOTA UNLIMITED ON TBS_CONCESIONARIA;

CONN autosAdmin/Pix3lif@localhost:1521/XEPDB1;

CREATE TABLE ESTADO(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        INCREMENT BY 1
        START WITH 1,
    ESTADO VARCHAR(20) NOT NULL,
    CONSTRAINT ESTADO_PK PRIMARY KEY (ID)
    );
  
CREATE TABLE ALC_MUN(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        INCREMENT BY 1
        START WITH 1,
    ALC_MUN VARCHAR(25) NOT NULL,
    ESTADO_ID NUMBER(2) NOT NULL,
    CONSTRAINT ALC_MUN_PK PRIMARY KEY (ID),
    CONSTRAINT ID_ESTADO_FK FOREIGN KEY (ESTADO_ID) REFERENCES ESTADO (ID)
);

CREATE TABLE DIRECCION(
    ID NUMBER (3) NOT NULL,
    ESTADO_ID NUMBER(2) NOT NULL,
    ALC_MUN_ID NUMBER (4) NOT NULL,
    COLONIA VARCHAR2(40) NOT NULL,
    CP NUMBER (5) NOT NULL,
    CALLE VARCHAR2(45) NOT NULL,
    NO_INT VARCHAR2(5),
    NO_EXT VARCHAR2(5) NOT NULL,
    CONSTRAINT DIRECCION_PK PRIMARY KEY (ID),
    CONSTRAINT ID_ESTADO_FKv1 FOREIGN KEY (ESTADO_ID) REFERENCES ESTADO (ID),
    CONSTRAINT ID_ALC_MUN_FK FOREIGN KEY (ALC_MUN_ID) REFERENCES ALC_MUN(ID)
);

CREATE TABLE CONCESIONARIA(
    CLAVE NUMBER(2) NOT NULL,
    NOMBRE VARCHAR2(20) NOT NULL,
    RFC VARCHAR2(13) UNIQUE NOT NULL,
    PAGINA_WEB VARCHAR2(100) UNIQUE NOT NULL,
    DIRECCION_ID NUMBER(3) NOT NULL,
    CONSTRAINT CONCESIONARIA_PK PRIMARY KEY (CLAVE),
    CONSTRAINT ID_DIRECCION_FK FOREIGN KEY (DIRECCION_ID) REFERENCES DIRECCION(ID)
);

CREATE TABLE CORREO_SUCURSAL(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    CORREO VARCHAR2(25) UNIQUE NOT NULL,
    CONCESIONARIA_CLAVE NUMBER(2) NOT NULL,
    CONSTRAINT CORREO_SUCURSAL_PK PRIMARY KEY(ID),
    CONSTRAINT CLAVE_CONCESIONARIA_FK FOREIGN KEY (CONCESIONARIA_CLAVE) REFERENCES CONCESIONARIA(CLAVE)
);


CREATE TABLE TELEFONO_SUCURSAL(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    TELEFONO VARCHAR2(10) NOT NULL,
    EXTENSION VARCHAR2(4) UNIQUE NOT NULL,
    CONCESIONARIA_CLAVE NUMBER(2) NOT NULL,
    CONSTRAINT TELEFONO_SUCURSAL_PK PRIMARY KEY (ID),
    CONSTRAINT CLAVE_CONCESIONARIA_FKv1 FOREIGN KEY (CONCESIONARIA_CLAVE) REFERENCES CONCESIONARIA (CLAVE)
);

CREATE TABLE CLIENTE (
    ID_C VARCHAR2(5) NOT NULL,
    NOMBRE VARCHAR2(15) NOT NULL,
    APELLIDO_PAT VARCHAR2(15) NOT NULL,
    APELLIDO_MAT VARCHAR2(15) NOT NULL,
    RFC VARCHAR2(13) UNIQUE NOT NULL,
    FECHA_NACI DATE NOT NULL,
    DIRECCION_ID NUMBER(3) NOT NULL,
    TIPO VARCHAR2(1) NOT NULL,
    CONSTRAINT CLIENTE_PK PRIMARY KEY (ID_C),
    CONSTRAINT FK_ID_DIRECCION FOREIGN KEY (DIRECCION_ID) REFERENCES DIRECCION (ID)
);

CREATE TABLE CONTACTO_CLIENTE(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    CORREO VARCHAR2(25) UNIQUE NOT NULL,
    TELEFONO VARCHAR2(10)UNIQUE NOT NULL,
    CLIENTE_ID_C VARCHAR2(5) NOT NULL,
    CONSTRAINT CONTACTO_CLIENTE_PK PRIMARY KEY (ID),
    CONSTRAINT ID_C_FK FOREIGN KEY (CLIENTE_ID_C) REFERENCES CLIENTE (ID_C)
    );

CREATE TABLE CARGO_EMPLEADO(
     ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    CARGO VARCHAR2(10) NOT NULL,
    CONSTRAINT CARGO_EMPLEADO_PK PRIMARY KEY (ID)
);

CREATE TABLE CONTACTO_EMPLEADO (
      ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    CORREO VARCHAR2(25) UNIQUE NOT NULL, 
    TELEFONO VARCHAR2(10) UNIQUE NOT NULL,
    CONSTRAINT CONTACTO_EMPLEADO_PK PRIMARY KEY (ID)
);

CREATE TABLE EMPLEADO(
    ID_E VARCHAR2(5) NOT NULL,
    NOMBRE VARCHAR2(15) NOT NULL,
    APELLIDO_PAT VARCHAR2(15) NOT NULL,
    APELLIDO_MAT VARCHAR2(15) NOT NULL,
    RFC VARCHAR2(13) UNIQUE NOT NULL,
    FECHA_NACI DATE NOT NULL,
    CARGO_EMPLEADO_ID NUMBER(1) NOT NULL,
    CONTACTO_EMPLEADO_ID NUMBER(2) NOT NULL,
    DIRECCION_ID NUMBER(3) NOT NULL,
    CONCESIONARIA_CLAVE NUMBER(2) NOT NULL,
    CONSTRAINT EMPLEADO_PK PRIMARY KEY (ID_E),
    CONSTRAINT ID_CARGO_EMPLEADO_FK FOREIGN KEY (CARGO_EMPLEADO_ID) REFERENCES CARGO_EMPLEADO(ID),
    CONSTRAINT ID_CONTACTO_EMPLEADO_FK FOREIGN KEY (CONTACTO_EMPLEADO_ID) REFERENCES CONTACTO_EMPLEADO(ID),
    CONSTRAINT ID_DIRECCION_FKv1 FOREIGN KEY (DIRECCION_ID) REFERENCES DIRECCION (ID),
    CONSTRAINT CLAVE_CONCESIONARIA_FKv2 FOREIGN KEY (CONCESIONARIA_CLAVE) REFERENCES CONCESIONARIA (CLAVE)
);

CREATE TABLE PAIS_PROVEEDOR(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 999
        INCREMENT BY 1
        START WITH 1,
    PAIS VARCHAR2(30) NOT NULL,
    CONSTRAINT PAIS_PROVEEDOR_PK PRIMARY KEY (ID)
);

CREATE TABLE PROVEEDOR(
    ID_P VARCHAR2(4) NOT NULL,
    EMPRESA VARCHAR2(25) NOT NULL,
    PAIS_PROVEEDOR_ID NUMBER(3) NOT NULL,
    NOMBRE_CONTACTO VARCHAR2(15) NOT NULL,
    APELLIDO_P_CONTACTO VARCHAR2(15) NOT NULL, 
    CONSTRAINT PROVEEDOR_PK PRIMARY KEY (ID_P),
    CONSTRAINT ID_PAIS_PROVEEDOR_FK FOREIGN KEY (PAIS_PROVEEDOR_ID) REFERENCES PAIS_PROVEEDOR (ID)
);

CREATE TABLE CONTACTO_PROVEEDOR(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    CORREO VARCHAR2(25) UNIQUE NOT NULL,
    TELEFONO VARCHAR2(10) UNIQUE NOT NULL,
    PROVEEDOR_ID_P VARCHAR2(4) NOT NULL,
    CONSTRAINT CONTACTO_PROVEEDOR_PK PRIMARY KEY(ID),
    CONSTRAINT ID_P_FK FOREIGN KEY (PROVEEDOR_ID_P) REFERENCES PROVEEDOR (ID_P)
);

CREATE TABLE COLOR(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 99
        INCREMENT BY 1
        START WITH 1,
    COLOR VARCHAR2(15) NOT NULL,
    CONSTRAINT COLOR_PK PRIMARY KEY (ID)
);

CREATE TABLE TIPO(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    TIPO VARCHAR2(15) NOT NULL,
    CONSTRAINT TIPO_PK PRIMARY KEY (ID)
);

CREATE TABLE TRANSMISION(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    TIPO VARCHAR2(15) NOT NULL,
    CONSTRAINT TRANSMISION_PK PRIMARY KEY (ID)
);

CREATE TABLE TIPO_MOTOR(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    TIPO VARCHAR2(20) NOT NULL,
    CONSTRAINT TIPO_MOTOR_PK PRIMARY KEY (ID)
);

CREATE TABLE ESTADO_V(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    ESTADO VARCHAR2(15) NOT NULL,
    CONSTRAINT ESTADO_V_PK PRIMARY KEY (ID)
);

CREATE TABLE MARCA(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 999
        INCREMENT BY 1
        START WITH 1,
    MARCA VARCHAR2(40) NOT NULL,
    CONSTRAINT MARCA_PK PRIMARY KEY (ID)
);

CREATE TABLE MODELO(
    ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 999
        INCREMENT BY 1
        START WITH 1,
    MODELO VARCHAR2(15) NOT NULL,
    MARCA_ID NUMBER(3) NOT NULL,
    CONSTRAINT MODELO_PK PRIMARY KEY (ID),
    CONSTRAINT ID_MARCA_FK FOREIGN KEY (MARCA_ID) REFERENCES MARCA (ID)
);

CREATE TABLE VEHICULO (
    ID_V VARCHAR2(6) NOT NULL,
    VIN VARCHAR2(17) UNIQUE NOT NULL,
    MARCA_ID NUMBER(3) NOT NULL,
    MODELO_ID NUMBER(3) NOT NULL,
    ANIO NUMBER(4) NOT NULL,
    COLOR_ID NUMBER(2) NOT NULL,
    TIPO_ID NUMBER (1) NOT NULL,
    LINEA VARCHAR2(25) NOT NULL,
    TRANSMISION_ID NUMBER(1) NOT NULL,
    PRECIO NUMBER(9,2) NOT NULL,
    ESTADO_V_ID NUMBER(1) NOT NULL,
    FECHA_INGRESO DATE NOT NULL,
    NUM_MOTOR VARCHAR2(25) UNIQUE NOT NULL,
    TIPO_MOTOR_ID NUMBER(1) NOT NULL,
    CAPACIDAD NUMBER(1) NOT NULL,
    NUM_CILINDROS NUMBER(2) NOT NULL,
    NUM_PUERTAS NUMBER(1) NOT NULL,
    PROVEEDOR_ID_FK VARCHAR2(4) NOT NULL,
    CONSTRAINT VEHICULO_PK PRIMARY KEY (ID_V),
    CONSTRAINT ID_MARCA_FKv1 FOREIGN KEY (MARCA_ID) REFERENCES MARCA (ID),
    CONSTRAINT ID_MODELO_FK FOREIGN KEY (MODELO_ID) REFERENCES MODELO (ID),
    CONSTRAINT ID_COLOR_FK FOREIGN KEY (COLOR_ID) REFERENCES COLOR (ID),
    CONSTRAINT ID_TIPO_MOTOR_FK FOREIGN KEY (TIPO_MOTOR_ID) REFERENCES TIPO_MOTOR (ID),
    CONSTRAINT ID_ESTADO_V_FK FOREIGN KEY (ESTADO_V_ID) REFERENCES ESTADO_V (ID),
    CONSTRAINT ID_TRANSMISION_FK FOREIGN KEY (TRANSMISION_ID) REFERENCES TRANSMISION (ID),
    CONSTRAINT ID_PROVEEDOR_FK FOREIGN KEY (PROVEEDOR_ID_FK) REFERENCES PROVEEDOR (ID_P),
    CONSTRAINT ID_TIPO_FK FOREIGN KEY (TIPO_ID) REFERENCES TIPO (ID)
);

CREATE TABLE METODO_PAGO(
     ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    METODO VARCHAR2(10) NOT NULL,
    CONSTRAINT METODO_PAGO_PK PRIMARY KEY (ID)
);

CREATE TABLE TIPO_GARANTIA(
     ID NUMERIC GENERATED BY DEFAULT AS IDENTITY
        MINVALUE 1
        MAXVALUE 9
        INCREMENT BY 1
        START WITH 1,
    GARANTIA VARCHAR2(15) NOT NULL,
    CONSTRAINT TIPO_GARANTIA_PK PRIMARY KEY (ID)
);

CREATE TABLE VENTA(
    CLAVE VARCHAR2(6) NOT NULL,
    FECHA_VENTA DATE NOT NULL,
    FECHA_ENTREGA DATE NOT NULL,
    NO_FACTURA VARCHAR2(20) UNIQUE NOT NULL,
    TIPO_GARANTIA_ID NUMBER(1) NOT NULL,
    CLIENTE_ID_C VARCHAR2(5) NOT NULL,
    EMPLEADO_ID_E VARCHAR2(5) NOT NULL,
    CONCESIONARIA_CLAVE NUMBER(2) NOT NULL,
    CONSTRAINT VENTA_PK PRIMARY KEY (CLAVE),
    CONSTRAINT ID_TIPO_GARANTIA_FK FOREIGN KEY (TIPO_GARANTIA_ID) REFERENCES TIPO_GARANTIA (ID),
    CONSTRAINT ID_CLIENTE_FK FOREIGN KEY (CLIENTE_ID_C) REFERENCES CLIENTE (ID_C),
    CONSTRAINT ID_EMPLEADO_FK FOREIGN KEY (EMPLEADO_ID_E) REFERENCES EMPLEADO (ID_E),
    CONSTRAINT CLAVE_CONCESIONARIA_FKv3 FOREIGN KEY (CONCESIONARIA_CLAVE) REFERENCES CONCESIONARIA (CLAVE)
);

CREATE TABLE DETALLE_PAGO (
    VENTA_CLAVE VARCHAR2(6) NOT NULL,
    METODO_PAGO_ID NUMBER(1) NOT NULL,
    MONTO_METODO NUMBER(9,2) NOT NULL,
    FECHA_PAGO DATE NOT NULL,
    CONSTRAINT DETALLE_PAGO_PK PRIMARY KEY (VENTA_CLAVE, METODO_PAGO_ID),
    CONSTRAINT CLAVE_VENTA_FK FOREIGN KEY (VENTA_CLAVE) REFERENCES VENTA (CLAVE),
    CONSTRAINT ID_METODO_PAGO_FK FOREIGN KEY (METODO_PAGO_ID) REFERENCES METODO_PAGO (ID)
);

CREATE TABLE DETALLE_VENTA(
    VENTA_CLAVE VARCHAR2(6) NOT NULL,
    VEHICULO_ID_V VARCHAR2(6) NOT NULL,
    CONSTRAINT DETALLE_VENTA_PK PRIMARY KEY (VENTA_CLAVE, VEHICULO_ID_V),
    CONSTRAINT CLAVE_VENTA_FKv1 FOREIGN KEY (VENTA_CLAVE) REFERENCES VENTA (CLAVE),
    CONSTRAINT ID_VEHICULO_FK FOREIGN KEY (VEHICULO_ID_V) REFERENCES VEHICULO (ID_V)
);


//Hasta aqui es la creacion de tablas

// Creacion de registros
// Estados
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Ciudad de México', 1);
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Jalisco', 2);
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Nuevo León', 3);
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Puebla', 4);
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Veracruz', 5);
INSERT INTO ESTADO (ESTADO, ID) VALUES ('Yucatán', 6);

SELECT * FROM ESTADO;
//Alcaldias municipios

INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Miguel Hidalgo', 1);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Zapopan', 2);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Monterrey', 3);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Puebla', 4);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Veracruz', 5);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Mérida', 6);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Guadalajara', 2);
INSERT INTO ALC_MUN (ALC_MUN, ESTADO_ID) VALUES ('Cuauhtémoc', 1);
SELECT * FROM ALC_MUN;

//Direccion

INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT)
VALUES (1, 1, 1, 'Polanco', 11510, 'Av. Presidente Masaryk', '101', '200');
INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT)
VALUES (2, 2, 2, 'Centro', 45100, 'Av. Patria', '202', '345');
INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT)
VALUES (3, 3, 3, 'San Pedro', 64000, 'Calzada del Valle', '303', '150');
INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT)
VALUES (4, 4, 4, 'Centro Histórico', 72000, '5 de Mayo', '404', '1');
INSERT INTO DIRECCION (ID, ESTADO_ID, ALC_MUN_ID, COLONIA, CP, CALLE, NO_INT, NO_EXT)
VALUES (5, 5, 5, 'Boca del Río', 94290, 'Blvd. Adolfo Ruiz Cortines', '505', '99');
SELECT * FROM DIRECCION;

//Concesionaria

INSERT INTO CONCESIONARIA (CLAVE, NOMBRE, RFC, PAGINA_WEB, DIRECCION_ID)
VALUES (1, 'Autos CDMX', 'CDMX890101AAA', 'https://autoscdfmx.com', 1);
INSERT INTO CONCESIONARIA (CLAVE, NOMBRE, RFC, PAGINA_WEB, DIRECCION_ID)
VALUES (2, 'Autos Jalisco', 'JAL910102BBB', 'https://autosjalisco.com', 2);
INSERT INTO CONCESIONARIA (CLAVE, NOMBRE, RFC, PAGINA_WEB, DIRECCION_ID)
VALUES (3, 'Autos Nuevo León', 'NL020303CCC', 'https://autosnl.com', 3);
INSERT INTO CONCESIONARIA (CLAVE, NOMBRE, RFC, PAGINA_WEB, DIRECCION_ID)
VALUES (4, 'Autos Puebla', 'PUE940404DDD', 'https://autospuebla.com', 4);
INSERT INTO CONCESIONARIA (CLAVE, NOMBRE, RFC, PAGINA_WEB, DIRECCION_ID)
VALUES (5, 'Autos Veracruz', 'VER950505EEE', 'https://autosveracruz.com', 5);
SELECT * FROM CONCESIONARIA JOIN CORREO_SUCURSAL ON CONCESIONARIA.CLAVE = CORREO_SUCURSAL.ID ;

//CORREO_SUCURSAL

INSERT INTO CORREO_SUCURSAL (CORREO, CONCESIONARIA_CLAVE)
VALUES ('contacto@autoscdfmx.com', 1);
INSERT INTO CORREO_SUCURSAL (CORREO, CONCESIONARIA_CLAVE)
VALUES ('ventas@autosjalisco.com', 2);
INSERT INTO CORREO_SUCURSAL (CORREO, CONCESIONARIA_CLAVE)
VALUES ('info@autosnl.com', 3);
INSERT INTO CORREO_SUCURSAL (CORREO, CONCESIONARIA_CLAVE)
VALUES ('soporte@autospuebla.com', 4);
INSERT INTO CORREO_SUCURSAL (CORREO, CONCESIONARIA_CLAVE)
VALUES ('aten@autosveracruz.com', 5);
SELECT * FROM CORREO_SUCURSAL;

//TELEFONO_SUCURSAL
INSERT INTO TELEFONO_SUCURSAL (TELEFONO, EXTENSION, CONCESIONARIA_CLAVE)
VALUES ('5512345678', '100', 1);
INSERT INTO TELEFONO_SUCURSAL (TELEFONO, EXTENSION, CONCESIONARIA_CLAVE)
VALUES ('3312345678', '200', 2);
INSERT INTO TELEFONO_SUCURSAL (TELEFONO, EXTENSION, CONCESIONARIA_CLAVE)
VALUES ('8112345678', '300', 3);
INSERT INTO TELEFONO_SUCURSAL (TELEFONO, EXTENSION, CONCESIONARIA_CLAVE)
VALUES ('2221234567', '400', 4);
INSERT INTO TELEFONO_SUCURSAL (TELEFONO, EXTENSION, CONCESIONARIA_CLAVE)
VALUES ('2291234567', '500', 5);
SELECT * FROM TELEFONO_SUCURSAL;


//Cliente
INSERT INTO CLIENTE (ID_C, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, DIRECCION_ID, TIPO) 
VALUES ('C001', 'Carlos', 'González', 'López', 'GOLC123456789', TO_DATE('1990-01-15', 'YYYY-MM-DD'), 1, 'A');
INSERT INTO CLIENTE (ID_C, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, DIRECCION_ID, TIPO) 
VALUES ('C002', 'María', 'Fernández', 'Martínez', 'FEMM234567891', TO_DATE('1985-03-22', 'YYYY-MM-DD'), 2, 'B');
INSERT INTO CLIENTE (ID_C, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, DIRECCION_ID, TIPO) 
VALUES ('C003', 'Juan', 'Pérez', 'Díaz', 'PEDJ345678912', TO_DATE('1978-05-30', 'YYYY-MM-DD'), 3, 'A');
INSERT INTO CLIENTE (ID_C, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, DIRECCION_ID, TIPO) 
VALUES ('C004', 'Ana', 'Sánchez', 'Ramírez', 'SARO456789123', TO_DATE('1995-07-08', 'YYYY-MM-DD'), 4, 'A');
INSERT INTO CLIENTE (ID_C, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, DIRECCION_ID, TIPO) 
VALUES ('C005', 'Luis', 'Hernández', 'García', 'HGLC567891234', TO_DATE('1989-09-14', 'YYYY-MM-DD'), 5, 'B');
SELECT * FROM CLIENTE JOIN DIRECCION ON CLIENTE.DIRECCION_ID = DIRECCION.ID;


//Contacto CLIENTE
INSERT INTO CONTACTO_CLIENTE (CORREO, CLIENTE_ID_C, TELEFONO) VALUES ('carlos.gonzalez@mail.com', 'C001','8112345670');
INSERT INTO CONTACTO_CLIENTE (CORREO, CLIENTE_ID_C, TELEFONO) VALUES ('maria.fernandez@mail.com', 'C002','3312345671');
INSERT INTO CONTACTO_CLIENTE (CORREO, CLIENTE_ID_C, TELEFONO) VALUES ('juan.perez@mail.com', 'C003','5512345672');
INSERT INTO CONTACTO_CLIENTE (CORREO, CLIENTE_ID_C, TELEFONO) VALUES ('ana.sanchez@mail.com', 'C004','2291234563');
INSERT INTO CONTACTO_CLIENTE (CORREO, CLIENTE_ID_C, TELEFONO) VALUES ('luis.hernandez@mail.com', 'C005','9991234564');
SELECT * FROM CLIENTE JOIN CONTACTO_CLIENTE ON CLIENTE.ID_C = CONTACTO_CLIENTE.CLIENTE_ID_C;

-- Tabla COLOR
INSERT INTO COLOR (COLOR, ID) VALUES ('Rojo',1);
INSERT INTO COLOR (COLOR, ID) VALUES ('Azul', 2);
INSERT INTO COLOR (COLOR, ID) VALUES ('Negro', 3);
INSERT INTO COLOR (COLOR, ID) VALUES ('Blanco', 4);
INSERT INTO COLOR (COLOR, ID) VALUES ('Gris', 5);
SELECT * FROM COLOR;
//CARGO EMPLEADO
INSERT INTO CARGO_EMPLEADO (ID, CARGO)
VALUES (1, 'Gerente');
INSERT INTO CARGO_EMPLEADO (ID, CARGO)
VALUES (2, 'Supervisor');
INSERT INTO CARGO_EMPLEADO (ID, CARGO)
VALUES (3, 'Vendedor');
INSERT INTO CARGO_EMPLEADO (ID, CARGO)
VALUES (4, 'Técnico');
INSERT INTO CARGO_EMPLEADO (ID, CARGO)
VALUES (5, 'Asistente');

//Contacto EMPLEADO
INSERT INTO CONTACTO_EMPLEADO (ID, TELEFONO, CORREO)
VALUES (1, '5551234123', 'juan.pz@gmail.com');
INSERT INTO CONTACTO_EMPLEADO (ID, TELEFONO, CORREO)
VALUES (2, '5555678484', 'maria.lez@gmail.com');
INSERT INTO CONTACTO_EMPLEADO (ID, TELEFONO, CORREO)
VALUES (3, '5558765974', 'luis.gaia@gmail.com');
INSERT INTO CONTACTO_EMPLEADO (ID, TELEFONO, CORREO)
VALUES (4, '5554321096', 'ana.herdez@gmail.com');
INSERT INTO CONTACTO_EMPLEADO (ID, TELEFONO, CORREO)
VALUES (5, '5551357184', 'carlos.rodrz@gmail.com');
select * from CONTACTO_EMPLEADO;
SELECT * FROM CLIENTE JOIN CONTACTO_CLIENTE ON CLIENTE.ID_C = CONTACTO_CLIENTE.CLIENTE_ID_C;

//EMPLEADO
INSERT INTO EMPLEADO (ID_E, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID, CONCESIONARIA_CLAVE)
VALUES ('E001', 'Juan', 'Pérez', 'Gómez', 'PEGA850321H8', TO_DATE('1985-03-21', 'YYYY-MM-DD'), 1, 1, 1, 1);
INSERT INTO EMPLEADO (ID_E, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID, CONCESIONARIA_CLAVE)
VALUES ('E002', 'María', 'López', 'Ruiz', 'LORM90051Z02', TO_DATE('1990-05-11', 'YYYY-MM-DD'), 2, 2, 2, 2);
INSERT INTO EMPLEADO (ID_E, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID, CONCESIONARIA_CLAVE)
VALUES ('E003', 'Luis', 'García', 'Martínez', 'GAML88015L03', TO_DATE('1988-07-15', 'YYYY-MM-DD'), 3, 3, 3, 3);
INSERT INTO EMPLEADO (ID_E, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID, CONCESIONARIA_CLAVE)
VALUES ('E004', 'Ana', 'Hernández', 'Vega', 'HEVA83092804', TO_DATE('1983-09-28', 'YYYY-MM-DD'), 4, 4, 4, 4);
INSERT INTO EMPLEADO (ID_E, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, RFC, FECHA_NACI, CARGO_EMPLEADO_ID, CONTACTO_EMPLEADO_ID, DIRECCION_ID, CONCESIONARIA_CLAVE)
VALUES ('E005', 'Carlos', 'Rodríguez', 'Flores', 'ROFL912HCL05', TO_DATE('1995-12-12', 'YYYY-MM-DD'), 1, 5, 5, 5);
SELECT * FROM EMPLEADO JOIN DIRECCION ON EMPLEADO.DIRECCION_ID = DIRECCION.ID;

//PAIS PROVEEDOR
INSERT INTO PAIS_PROVEEDOR (ID, PAIS)
VALUES (1, 'México');
INSERT INTO PAIS_PROVEEDOR (ID, PAIS)
VALUES (2, 'Estados Unidos');
INSERT INTO PAIS_PROVEEDOR (ID, PAIS)
VALUES (3, 'Alemania');
INSERT INTO PAIS_PROVEEDOR (ID, PAIS)
VALUES (4, 'Japón');
INSERT INTO PAIS_PROVEEDOR (ID, PAIS)
VALUES (5, 'China');


//PROVEEDOR
INSERT INTO PROVEEDOR (ID_P, EMPRESA, PAIS_PROVEEDOR_ID, NOMBRE_CONTACTO, APELLIDO_P_CONTACTO)
VALUES ('P001', 'Proveedor A', 1, 'Juan', 'Pérez');
INSERT INTO PROVEEDOR (ID_P, EMPRESA, PAIS_PROVEEDOR_ID, NOMBRE_CONTACTO, APELLIDO_P_CONTACTO)
VALUES ('P002', 'Proveedor B', 2, 'Carlos', 'Gómez');
INSERT INTO PROVEEDOR (ID_P, EMPRESA, PAIS_PROVEEDOR_ID, NOMBRE_CONTACTO, APELLIDO_P_CONTACTO)
VALUES ('P003', 'Proveedor C', 3, 'María', 'López');
INSERT INTO PROVEEDOR (ID_P, EMPRESA, PAIS_PROVEEDOR_ID, NOMBRE_CONTACTO, APELLIDO_P_CONTACTO)
VALUES ('P004', 'Proveedor D', 4, 'Pedro', 'Martínez');
INSERT INTO PROVEEDOR (ID_P, EMPRESA, PAIS_PROVEEDOR_ID, NOMBRE_CONTACTO, APELLIDO_P_CONTACTO)
VALUES ('P005', 'Proveedor E', 5, 'Ana', 'Hernández');

//CONTACTO PROVEEDOR
INSERT INTO CONTACTO_PROVEEDOR (ID, CORREO, TELEFONO, PROVEEDOR_ID_P)
VALUES (1, 'contacto1@proveedor.com', '555116711', 'P001');
INSERT INTO CONTACTO_PROVEEDOR (ID, CORREO, TELEFONO, PROVEEDOR_ID_P)
VALUES (2, 'contacto2@proveedor.com', '555222092', 'P002');
INSERT INTO CONTACTO_PROVEEDOR (ID, CORREO, TELEFONO, PROVEEDOR_ID_P)
VALUES (3, 'contacto3@proveedor.com', '555643333', 'P003');
INSERT INTO CONTACTO_PROVEEDOR (ID, CORREO, TELEFONO, PROVEEDOR_ID_P)
VALUES (4, 'contacto4@proveedor.com', '555944444', 'P004');
INSERT INTO CONTACTO_PROVEEDOR (ID, CORREO, TELEFONO, PROVEEDOR_ID_P)
VALUES (5, 'contacto5@proveedor.com', '555405555', 'P005');
SELECT * FROM PROVEEDOR JOIN CONTACTO_PROVEEDOR ON PROVEEDOR.ID_P = CONTACTO_PROVEEDOR.PROVEEDOR_ID_P;

//TRANSMISION
INSERT INTO TRANSMISION (ID, TIPO)
VALUES (1, 'Manual');
INSERT INTO TRANSMISION (ID, TIPO)
VALUES (2, 'Automática');

//TIPO MOTOR
INSERT INTO TIPO_MOTOR (ID, TIPO)
VALUES (1, 'Gasolina');
INSERT INTO TIPO_MOTOR (ID, TIPO)
VALUES (2, 'Diésel');
INSERT INTO TIPO_MOTOR (ID, TIPO)
VALUES (3, 'Eléctrico');
INSERT INTO TIPO_MOTOR (ID, TIPO)
VALUES (4, 'Híbrido');
INSERT INTO TIPO_MOTOR (ID, TIPO)
VALUES (5, 'Hidrógeno');

//TIPO GARANTIA
INSERT INTO TIPO_GARANTIA (ID, GARANTIA)
VALUES (1, 'NORMAL');
INSERT INTO TIPO_GARANTIA (ID, GARANTIA)
VALUES (2, 'EXTENDIDA');
INSERT INTO TIPO_GARANTIA (ID, GARANTIA)
VALUES (3, 'PLUS');
INSERT INTO TIPO_GARANTIA (ID, GARANTIA)
VALUES (4, 'PLATINO');
INSERT INTO TIPO_GARANTIA (ID, GARANTIA)
VALUES (5, 'PLUS PLATINO');

//TIPO
INSERT INTO TIPO (ID, TIPO)
VALUES (1, 'Sedán');
INSERT INTO TIPO (ID, TIPO)
VALUES (2, 'SUV');
INSERT INTO TIPO (ID, TIPO)
VALUES (3, 'Camioneta');
INSERT INTO TIPO (ID, TIPO)
VALUES (4, 'Coupé');
INSERT INTO TIPO (ID, TIPO)
VALUES (5, 'Deportivo');
INSERT INTO TIPO (ID, TIPO)
VALUES (6, 'Hatchback');
select * from tipo;

//MARCA
INSERT INTO MARCA (ID, MARCA)
VALUES (1, 'Toyota');
INSERT INTO MARCA (ID, MARCA)
VALUES (2, 'Honda');
INSERT INTO MARCA (ID, MARCA)
VALUES (3, 'Ford');
INSERT INTO MARCA (ID, MARCA)
VALUES (4, 'Seat');
INSERT INTO MARCA (ID, MARCA)
VALUES (5, 'Nissan');

//MODELO
INSERT INTO MODELO (ID, MODELO, MARCA_ID)
VALUES (1, 'Corolla', 1);
INSERT INTO MODELO (ID, MODELO, MARCA_ID)
VALUES (2, 'Civic', 2);
INSERT INTO MODELO (ID, MODELO, MARCA_ID)
VALUES (3, 'Mustang', 3);
INSERT INTO MODELO (ID, MODELO, MARCA_ID)
VALUES (4, 'Ibiza', 4);
INSERT INTO MODELO (ID, MODELO, MARCA_ID)
VALUES (5, 'Altima', 5);

//ESTADO_V
INSERT INTO ESTADO_V (ID, ESTADO)
VALUES (1, 'Nuevo');
INSERT INTO ESTADO_V (ID, ESTADO)
VALUES (2, 'Semi-nuevo');

//VEHICULO
INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK)
VALUES ('V001', '1HGBH41JXMN109186', 1, 1, 2023, 1, 1, 'El chido', 1, 20000.00, 1, TO_DATE('2024-01-15', 'YYYY-MM-DD'), '1234567890', 1, 5, 4, 4, 'P001');
INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK)
VALUES ('V002', '1HGCM82633A123456', 2, 2, 2022, 2, 2, 'v-tec', 2, 35000.00, 2, TO_DATE('2024-01-16', 'YYYY-MM-DD'), '0987654321', 2, 7, 6, 5, 'P002');
INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK)
VALUES ('V003', '1NXBR32E54Z123456', 3, 3, 2021, 3, 3, 'Dark Horse', 2, 15000.00, 1, TO_DATE('2024-01-17', 'YYYY-MM-DD'), '2468135790', 3, 4, 4, 3, 'P003');
INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK)
VALUES ('V004', '2G1FC1E32A9171395', 4, 4, 2020, 4, 4, 'FR', 1, 28000.00, 1, TO_DATE('2024-01-18', 'YYYY-MM-DD'), '1122334455', 4, 6, 4, 2, 'P004');
INSERT INTO VEHICULO (ID_V, VIN, MARCA_ID, MODELO_ID, ANIO, COLOR_ID, TIPO_ID, LINEA, TRANSMISION_ID, PRECIO, ESTADO_V_ID, FECHA_INGRESO, NUM_MOTOR, TIPO_MOTOR_ID, CAPACIDAD, NUM_CILINDROS, NUM_PUERTAS, PROVEEDOR_ID_FK)
VALUES ('V005', '3CZRU6H57KG710234', 5, 5, 2023, 5, 5, 'Lujo', 2, 40000.00, 2, TO_DATE('2024-01-19', 'YYYY-MM-DD'), '5566778899', 5, 8, 8, 2, 'P005');
SELECT * FROM VEHICULO;

//METODO PAGO
ALTER TABLE METODO_PAGO
MODIFY (METODO VARCHAR2(30));
INSERT INTO METODO_PAGO (ID, METODO)
VALUES (1, 'Tarjeta de Crédito');
INSERT INTO METODO_PAGO (ID, METODO)
VALUES (2, 'Transferencia Bancaria');
INSERT INTO METODO_PAGO (ID, METODO)
VALUES (3, 'Efectivo');
INSERT INTO METODO_PAGO (ID, METODO)
VALUES (4, 'Credito');
INSERT INTO METODO_PAGO (ID, METODO)
VALUES (5, 'Cheque');
SELECT * FROM METODO_PAGO;

//VENTA
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V001', TO_DATE('2024-11-10', 'YYYY-MM-DD'), TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'F001', 1, 'C001', 'E001', '1');
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V002', TO_DATE('2024-11-11', 'YYYY-MM-DD'), TO_DATE('2024-11-16', 'YYYY-MM-DD'), 'F002', 2, 'C002', 'E002', '2');
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V003', TO_DATE('2024-11-12', 'YYYY-MM-DD'), TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'F003', 3, 'C003', 'E003', '3');
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V004', TO_DATE('2024-11-13', 'YYYY-MM-DD'), TO_DATE('2024-11-18', 'YYYY-MM-DD'), 'F004', 4, 'C004', 'E004', '4');
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V005', TO_DATE('2024-11-14', 'YYYY-MM-DD'), TO_DATE('2024-11-19', 'YYYY-MM-DD'), 'F005', 5, 'C005', 'E005', '5');

SELECT * FROM EMPLEADO;
SELECT * FROM CLIENTE;
SELECT * FROM CONCESIONARIA;

//DETALLE PAGO
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V001', 1, 5000.00, TO_DATE('2024-11-10', 'YYYY-MM-DD'));
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V002', 2, 3000.00, TO_DATE('2024-11-11', 'YYYY-MM-DD'));
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V003', 3, 1500.00, TO_DATE('2024-11-12', 'YYYY-MM-DD'));
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V004', 4, 2000.00, TO_DATE('2024-11-13', 'YYYY-MM-DD'));
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V005', 5, 2500.00, TO_DATE('2024-11-14', 'YYYY-MM-DD'));

//DETALLE VENTA

INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V001', 'V001');
INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V002', 'V002');
INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V003', 'V003');
INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V004', 'V004');
INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V005', 'V005');

SELECT * FROM VEHICULO JOIN VENTA ON VEHICULO.ID_V = VENTA.CLAVE JOIN DETALLE_VENTA ON VEHICULO.ID_V = DETALLE_VENTA.VENTA_CLAVE
JOIN DETALLE_PAGO ON VEHICULO.ID_V = DETALLE_PAGO.VENTA_CLAVE;


//REGISTROS EXTRAS
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V006', TO_DATE('2024-11-14', 'YYYY-MM-DD'), TO_DATE('2024-11-19', 'YYYY-MM-DD'), 'F006', 5, 'C005', 'E005', '5');

INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V006', 5, 2500.00, TO_DATE('2024-11-14', 'YYYY-MM-DD'));

INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V006', 'V005');

    
INSERT INTO VENTA (CLAVE, FECHA_VENTA, FECHA_ENTREGA, NO_FACTURA, TIPO_GARANTIA_ID, CLIENTE_ID_C, EMPLEADO_ID_E, CONCESIONARIA_CLAVE)
VALUES ('V006', TO_DATE('2024-11-14', 'YYYY-MM-DD'), TO_DATE('2024-11-19', 'YYYY-MM-DD'), 'F006', 5, 'C005', 'E005', '5');
INSERT INTO DETALLE_PAGO (VENTA_CLAVE, METODO_PAGO_ID, MONTO_METODO, FECHA_PAGO)
VALUES ('V006', 5, 2500.00, TO_DATE('2024-11-14', 'YYYY-MM-DD'));
INSERT INTO DETALLE_VENTA (VENTA_CLAVE, VEHICULO_ID_V)
VALUES ('V006', 'V004');

