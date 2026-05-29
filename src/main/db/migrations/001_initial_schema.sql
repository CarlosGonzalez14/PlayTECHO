PRAGMA foreign_keys = ON;

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE preguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta TEXT NOT NULL,
    dificultad TEXT NOT NULL CHECK (dificultad IN ('facil', 'media', 'dificil')),
    categoria_id INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicada')),

    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE respuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    respuesta TEXT NOT NULL,
    puntaje INTEGER NOT NULL CHECK (puntaje > 0),
    pregunta_id INTEGER NOT NULL,

    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);