import { getDatabase } from '../database';

export interface CategoryRow {
  id: number;
  nombre: string;
}

export function getAllCategories(): CategoryRow[] {
  const database = getDatabase();

  return database
    .prepare(
      `
      SELECT id, nombre
      FROM categorias
      ORDER BY nombre ASC
      `
    )
    .all() as CategoryRow[];
}

export function createCategory(nombre: string): CategoryRow {
  const database = getDatabase();
  const cleanedName = nombre.trim();

  if (!cleanedName) {
    throw new Error('El nombre de la categoría no puede estar vacío.');
  }

  const existingCategory = database
    .prepare(
      `
      SELECT id, nombre
      FROM categorias
      WHERE LOWER(nombre) = LOWER(?)
      `
    )
    .get(cleanedName) as CategoryRow | undefined;

  if (existingCategory) {
    return existingCategory;
  }

  const result = database
    .prepare(
      `
      INSERT INTO categorias (nombre)
      VALUES (?)
      `
    )
    .run(cleanedName);

  return {
    id: Number(result.lastInsertRowid),
    nombre: cleanedName,
  };
}