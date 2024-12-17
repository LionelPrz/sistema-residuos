use mapas_dinamicos;

CREATE table registro_residuos(
	registro_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	fecha DATE,
	ubicacion INT UNSIGNED,
	residuos INT UNSIGNED,
	relevadores INT UNSIGNED,
	FOREIGN KEY(ubicacion) REFERENCES ubicacion_residuo(ubicacion_id),
	FOREIGN KEY(residuos) REFERENCES datos_residuos(residuo_id),
	FOREIGN KEY(relevadores) REFERENCES datos_relevador(relevador_id)
);

CREATE table ubicacion_residuo(
	ubicacion_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	latitud FLOAT(10,6),
	longitud FLOAT(10,6)
);

CREATE table datos_residuos(
	residuo_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo_residuo VARCHAR(50)
);

CREATE table datos_relevador(
	relevador_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	dni INT(8) UNIQUE,
	nombre_apellido VARCHAR(75)
);

CREATE table accesibilidad(
	accesibilidad_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo_acceso VARCHAR(50)
);

ALTER TABLE datos_residuos ADD COLUMN accesibilidad_id INT UNSIGNED,
ADD FOREIGN KEY (accesibilidad_id) REFERENCES accesibilidad(accesibilidad_id);

-- Índices en las claves foráneas de la tabla registro_residuos
CREATE INDEX idx_ubicacion ON registro_residuos (ubicacion);
CREATE INDEX idx_residuos ON registro_residuos (residuos);
CREATE INDEX idx_relevadores ON registro_residuos (relevadores);

-- Índice para la columna fecha (frecuente en filtros)
CREATE INDEX idx_fecha ON registro_residuos (fecha);

INSERT INTO datos_residuos (tipo_residuo)
VALUES ('Macrobasural'),
		('Microbasural'),
       ('Basural Municipal'),
       ('Fosa común domiciliaria');

INSERT INTO accesibilidad (tipo_acceso) VALUES
('Fácil'),
('Moderado'),
('Difícil');


INSERT INTO datos_relevador (dni, nombre_apellido) VALUES
(11111111, 'Juan Pérez'),
(22222222, 'Ana Gómez'),
(33333333, 'Carlos Ruiz');

INSERT INTO registro_residuos (fecha, ubicacion, residuos, relevadores) VALUES
('2024-12-16', 1, 1, 1),  -- Registro para el relevador 1, tipo de residuo 1, ubicacion 1
('2024-12-16', 2, 2, 2),  -- Registro para el relevador 2, tipo de residuo 2, ubicacion 2
('2024-12-16', 3, 3, 3);  -- Registro para el relevador 3, tipo de residuo 3, ubicacion 3

INSERT INTO ubicacion_residuo (latitud, longitud) VALUES
(40.712776, -74.005974),  -- Ejemplo: Nueva York
(34.052235, -118.243683), -- Ejemplo: Los Ángeles
(51.507351, -0.127758);   -- Ejemplo: Londres


SELECT 
    r.registro_id,
    r.fecha,
    u.latitud,
    u.longitud,
    dr.tipo_residuo,
    rv.dni,
    rv.nombre_apellido,
    a.tipo_acceso AS accesibilidad
FROM 
    registro_residuos r
JOIN 
    ubicacion_residuo u ON r.ubicacion = u.ubicacion_id
JOIN 
    datos_residuos dr ON r.residuos = dr.residuo_id
JOIN 
    datos_relevador rv ON r.relevadores = rv.relevador_id
LEFT JOIN 
    accesibilidad a ON r.residuos = a.accesibilidad_id
ORDER BY 
    r.registro_id ASC;
   
ALTER TABLE datos_residuos AUTO_INCREMENT = 1;
ALTER TABLE ubicacion_residuo AUTO_INCREMENT = 1;
ALTER TABLE datos_relevador AUTO_INCREMENT = 1;
ALTER TABLE registro_residuos AUTO_INCREMENT = 1;

DELETE FROM registro_residuos;
DELETE FROM datos_residuos;
DELETE FROM datos_relevador;
DELETE FROM ubicacion_residuo;
DELETE FROM accesibilidad;


-- Cambiar la tabla para asociar el tipo de residuo con su ID en vez de guardar su descripción directamente
ALTER TABLE registro_residuos
DROP COLUMN residuos,
ADD COLUMN tipo_residuo_id INT UNSIGNED;

-- Cambiar la tabla para asociar el ID de accesibilidad en vez de la descripción
ALTER TABLE registro_residuos
DROP COLUMN accesibilidad,
ADD COLUMN accesibilidad_id INT UNSIGNED;

-- Luego de eso, definimos las claves foráneas
ALTER TABLE registro_residuos
ADD CONSTRAINT fk_tipo_residuo FOREIGN KEY (tipo_residuo_id) REFERENCES datos_residuos(residuo_id),
ADD CONSTRAINT fk_accesibilidad FOREIGN KEY (accesibilidad_id) REFERENCES accesibilidad(id);

