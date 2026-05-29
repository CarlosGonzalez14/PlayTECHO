import { app } from 'electron';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { initialSchemaSql } from './schema';

let database: Database.Database | null = null;

export function getDatabase() {
  if (database) {
    return database;
  }

  const databaseDirectory = path.join(app.getPath('userData'), 'data');

  if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
  }

  const databasePath = path.join(databaseDirectory, 'playtecho.sqlite');

  database = new Database(databasePath);
  database.pragma('foreign_keys = ON');
  database.exec(initialSchemaSql);

  console.log(`Base de datos PlayTECHO lista en: ${databasePath}`);

  return database;
}