use mapas_dinamicos;

CREATE table registro_residuos(
	registro_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	fecha DATE,
	ubicacion INT UNSIGNED,
	residuos INT UNSIGNED,
	relevadores INT UNSIGNED,
	acceso INT UNSIGNED,
	FOREIGN KEY(ubicacion) REFERENCES ubicacion_residuo(ubicacion_id),
	FOREIGN KEY(residuos) REFERENCES datos_residuos(residuo_id),
	FOREIGN KEY(relevadores) REFERENCES datos_relevador(relevador_id),
	FOREIGN KEY(acceso) REFERENCES accesibilidad(accesibilidad_id)
);

CREATE table ubicacion_residuo(
	ubicacion_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	latitud FLOAT(10,6),
	longitud FLOAT(10,6)
);

CREATE table datos_residuos(
	residuo_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo_residuo UNIQUE VARCHAR(25)
);

CREATE table datos_relevador(
	relevador_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	dni INT(8) UNIQUE,
	nombre_apellido VARCHAR(75)
);

CREATE table accesibilidad(
	accesibilidad_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tipo_acceso UNIQUE VARCHAR(25)
);

-- Índices en las claves foráneas de la tabla registro_residuos
CREATE INDEX idx_ubicacion ON registro_residuos (ubicacion);
CREATE INDEX idx_residuos ON registro_residuos (residuos);
CREATE INDEX idx_relevadores ON registro_residuos (relevadores);

-- Índice para la columna fecha (frecuente en filtros)
CREATE INDEX idx_fecha ON registro_residuos (fecha);
CREATE INDEX idx_acceso ON registro_residuos (acceso);

ALTER TABLE datos_residuos AUTO_INCREMENT = 1;
ALTER TABLE ubicacion_residuo AUTO_INCREMENT = 1;
ALTER TABLE datos_relevador AUTO_INCREMENT = 1;
ALTER TABLE registro_residuos AUTO_INCREMENT = 1;

DELETE FROM registro_residuos;
DELETE FROM datos_residuos;
DELETE FROM datos_relevador;
DELETE FROM ubicacion_residuo;
DELETE FROM accesibilidad;

