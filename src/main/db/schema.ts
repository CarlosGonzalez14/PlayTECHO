export const initialSchemaSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS preguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta TEXT NOT NULL,
    dificultad TEXT NOT NULL CHECK (dificultad IN ('facil', 'media', 'dificil')),
    categoria_id INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicada')),

    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS respuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    respuesta TEXT NOT NULL,
    puntaje INTEGER NOT NULL CHECK (puntaje > 0),
    pregunta_id INTEGER NOT NULL,

    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS validar_maximo_respuestas
BEFORE INSERT ON respuestas
FOR EACH ROW
WHEN (
    SELECT COUNT(*)
    FROM respuestas
    WHERE pregunta_id = NEW.pregunta_id
) >= 10
BEGIN
    SELECT RAISE(ABORT, 'Una pregunta no puede tener más de 10 respuestas');
END;

CREATE TRIGGER IF NOT EXISTS validar_suma_puntajes_insert
BEFORE INSERT ON respuestas
FOR EACH ROW
WHEN (
    SELECT COALESCE(SUM(puntaje), 0)
    FROM respuestas
    WHERE pregunta_id = NEW.pregunta_id
) + NEW.puntaje > 100
BEGIN
    SELECT RAISE(ABORT, 'La suma de puntajes de una pregunta no puede superar 100');
END;

CREATE TRIGGER IF NOT EXISTS validar_suma_puntajes_update
BEFORE UPDATE OF puntaje, pregunta_id ON respuestas
FOR EACH ROW
WHEN (
    SELECT COALESCE(SUM(puntaje), 0)
    FROM respuestas
    WHERE pregunta_id = NEW.pregunta_id
      AND id != OLD.id
) + NEW.puntaje > 100
BEGIN
    SELECT RAISE(ABORT, 'La suma de puntajes de una pregunta no puede superar 100');
END;

CREATE TRIGGER IF NOT EXISTS validar_pregunta_publicada
BEFORE UPDATE OF estado ON preguntas
FOR EACH ROW
WHEN NEW.estado = 'publicada'
AND (
    (
        SELECT COUNT(*)
        FROM respuestas
        WHERE pregunta_id = NEW.id
    ) < 4
    OR
    (
        SELECT COUNT(*)
        FROM respuestas
        WHERE pregunta_id = NEW.id
    ) > 10
    OR
    (
        SELECT COALESCE(SUM(puntaje), 0)
        FROM respuestas
        WHERE pregunta_id = NEW.id
    ) != 100
)
BEGIN
    SELECT RAISE(ABORT, 'Para publicar una pregunta debe tener entre 4 y 10 respuestas y sumar exactamente 100 puntos');
END;
`;